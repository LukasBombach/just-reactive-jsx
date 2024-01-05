import c from "chalk";
import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { compileServerBundle, render } from "renderer/ssr";

export async function startDevServer() {
  new Elysia()
    .use(html())
    .onStart(async () => {
      console.log(" -", c.blue("ready"), "http://localhost:3000\n");
      await compileServerBundle("index.tsx");
      console.log(" -", c.green("compiled"), "index.tsx");
    })
    .onResponse(({ path }) => console.log(" -", `${c.blue(200)}`.padEnd(8, " "), path))
    .get("/", () => render("index.js"))
    .listen(3000);
}
