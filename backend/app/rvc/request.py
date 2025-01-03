import base64
import json
import logging
from timeit import default_timer as timer

import filetype
import httpx
from fastapi import HTTPException
import pydub
import io

logger = logging.getLogger(__name__)


def check_extension(input: bytes) -> (bool, str):
    extension = filetype.guess_extension(input)
    logger.info(f"input extension: [{extension}]")
    if extension in ["wav", "mp3", "webm"]:
        return True, extension
    else:
        return False, extension


def rvc_infer_request(input_wav: bytes) -> bytes:
    """
    bytes: wav 파일

    return: 변환된 wav 파일
    """

    if_supported, extension = check_extension(input_wav)

    if extension == "webm":
        logger.info("converting webm to wav")
        audio = pydub.AudioSegment.from_file(io.BytesIO(input_wav), format="webm")

        audio_wav = io.BytesIO()
        audio.export(audio_wav,  format="wav")
        input_wav = audio_wav.getvalue()

    if not if_supported:
        error_msg = f"extension [{extension}] is not supported"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

    wav_base64_decoded = base64.b64encode(input_wav).decode('utf-8')

    infer_start_time = timer()
    resp = httpx.post(
        url="https://peg8pmh825.execute-api.ap-northeast-2.amazonaws.com/dev/rvc_3",
        json={'wav_file': wav_base64_decoded},
        timeout=60
    )
    infer_end_time = timer()

    logger.info(f"inference duration: {infer_end_time - infer_start_time}")

    if resp.status_code != 200:
        error_msg = f"request for voice conversion failed: status_code=[{resp.status_code}]"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail={"detail": error_msg})

    try:
        resp_body = json.loads(resp.content)
        output_wav = base64.b64decode(resp_body['wav_b64'])
    except Exception as e:
        error_msg = f"parsing and decoding response failed =[{str(e)}]"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail={"detail": error_msg})

    return output_wav
