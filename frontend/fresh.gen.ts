// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $index from "./routes/index.tsx";
import * as $my_index from "./routes/my/index.tsx";
import * as $send_index from "./routes/send/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $DropdownListForm from "./islands/DropdownListForm.tsx";
import * as $uploadResult from "./islands/uploadResult.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/index.tsx": $index,
    "./routes/my/index.tsx": $my_index,
    "./routes/send/index.tsx": $send_index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/DropdownListForm.tsx": $DropdownListForm,
    "./islands/uploadResult.tsx": $uploadResult,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
