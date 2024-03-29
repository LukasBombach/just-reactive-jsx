import { watch } from "fs";
import { Elysia } from "elysia";
import { html } from "server/contenttype";
import { log } from "server/log";
import { compileServerBundle, render } from "renderer/ssr";
import { compileClientBundle } from "renderer/client";

/**
 * Note to self: Virutal Modules
 * https://bun.sh/docs/runtime/plugins#virtual-modules
 */
export async function startDevServer() {
  new Elysia()

    // Headers
    .use(html())

    // Start server
    .onStart(() => {
      log.blue("ready", "http://localhost:3000", "\n");
    })

    // Server bundle (todo: with watch mode)
    .onStart(async () => {
      await compileServerBundle("index");
      log.green("compiled", "server/index");
    })

    // Client bundle (todo: with watch mode)
    .onStart(async () => {
      await compileClientBundle("index");
      log.green("compiled", "client/index");
    })

    // Log requests
    .onResponse(({ path }) => log.blue(200, path))

    // Serve index.html
    .get("/", () => render("index"))

    // Serve static assets
    .get("/index.js", () => Bun.file("build/client/index.js"))

    // Dev code: hydrate.js
    .get(
      "/hydrate.js",
      () =>
        new Response(`import Page from "./index.js";console.log(Page());`, {
          headers: { "Content-Type": "application/javascript" },
        })
    )

    // Start server
    .listen(3000);
}

// Watch for changes (todo: remove me)
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
