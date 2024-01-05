import c from "chalk";
import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { getHtml } from "renderer/ssr";

// todo watch app dir for changes and recompile
const ssr = await getHtml("app/index.tsx");

export async function startDevServer() {
  new Elysia()
    .use(html())
    .onStart(() => console.log("\n 🚀 http://localhost:3000\n"))
    .onResponse(({ path }) => console.log(" - ", c.blue(200), path))
    .get("/", () => ssr)
    .listen(3000);
}
