import { getJwt } from "@/app/lib/auth_jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { token, user, error } = getJwt(req);
  if (error) NextResponse.json({ user: null });

  const { id } = params;

  console.log("Fetching audio id " + id);

  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/voice/${id}/audio`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { message: "Failed to download file", error: errorData },
        { status: backendResponse.status }
      );
    }

    const stream = backendResponse.body;

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type":
          backendResponse.headers.get("Content-Type") || "audio/mpeg",
        "Content-Disposition": `attachment; filename="audio_${id}.mp3"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}