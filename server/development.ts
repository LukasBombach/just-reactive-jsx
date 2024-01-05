import { watch } from "fs";
import { Elysia } from "elysia";
import { html } from "server/contenttype";
import { log } from "server/log";
import { compileServerBundle, render } from "renderer/ssr";

export async function startDevServer() {
  new Elysia()
    .use(html())
    .onStart(async () => {
      log.blue("ready", "http://localhost:3000", "\n");
      await compileServerBundle("index");
      log.green("compiled", "server/index");
    })
    .onResponse(({ path }) => log.blue(200, path))
    .get("/", () => render("index"))
    .get("/index.js", () => Bun.file("build/client/index.js"))
    .listen(3000);
}

watch("app", { recursive: true }, async () => {
  await compileServerBundle("index");
  log.green("compiled", "server/index");
});
