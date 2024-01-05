import { Elysia } from "elysia";

export function html() {
  return new Elysia().onAfterHandle(({ response, set }) => {
    if (isHtml(response)) set.headers["Content-Type"] = "text/html; charset=utf8";
  });
}

/**
 * From @see https://github.com/elysiajs/elysia-html/blob/main/src/utils.ts
 */
function isHtml(this: void, value?: any): value is string {
  if (typeof value !== "string") return false;

  value = value.trim();
  const length = value.length;

  return (
    // Minimum html is 7 characters long: <a></a>
    length >= 7 &&
    // open tag
    value[0] === "<" &&
    // close tag
    value[length - 1] === ">"
  );
}
