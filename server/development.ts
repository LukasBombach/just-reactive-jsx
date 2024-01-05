import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { compileServerBundle, render } from "renderer/ssr";
import { log } from "server/log";

export async function startDevServer() {
  new Elysia()
    .use(html())
    .onStart(() => {
      log.blue("ready", "http://localhost:3000", "\n");
    })
    .onStart(async () => {
      await compileServerBundle("index.tsx");
      log.green("compiled", "index.tsx");
    })
    .onResponse(({ path }) => log.blue(200, path))
    .get("/", () => render("index.js"))
    .listen(3000);
}
