/// <reference lib="dom" />

import { render } from "lib/render";

declare const REQUESTED_PAGE_PATH: string;

import(REQUESTED_PAGE_PATH).then(Page => {
  document.body.appendChild(render(<Page.default />));
});
