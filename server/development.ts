import { watch } from "fs";
import { Elysia } from "elysia";
import { html } from "server/contenttype";
import { log } from "server/log";
import { compileServerBundle, render } from "renderer/ssr";
import { compileClientBundle } from "renderer/client";

// Note to self: Virutal Modules
// https://bun.sh/docs/runtime/plugins#virtual-modules

export async function startDevServer() {
  new Elysia()
    .use(html())
    .onStart(async () => {
      log.blue("ready", "http://localhost:3000", "\n");
      await compileServerBundle("index");
      log.green("compiled", "server/index");
      await compileClientBundle("index");
      log.green("compiled", "client/index");
    })
    .onResponse(({ path }) => log.blue(200, path))
    .get("/", () => render("index"))
    .get("/index.js", () => Bun.file("build/client/index.js"))
    .listen(3000);
}

const watcher = watch("app", { recursive: true }, async () => {
  await compileServerBundle("index");
  log.green("compiled", "server/index");
  await compileClientBundle("index");
  log.green("compiled", "client/index");
});

process.on("SIGINT", () => {
  watcher.close();
  process.exit(0);
});
