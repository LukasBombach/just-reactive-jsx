import { transformReactiveCode } from "renderer/transformReactiveCode";
import { renderToString } from "../src/server/renderToString";

import type { BunPlugin } from "bun";

function app(path: string) {
  return "app/" + path + ".tsx";
}

function dist(fileName?: string) {
  return fileName ? "build/server/" + fileName + ".js" : "build/server";
}

export async function compileServerBundle(file: string): Promise<void> {
  const { logs } = await Bun.build({ entrypoints: [app(file)], outdir: dist(), plugins: [serverJsPlugin()] });
  logs.forEach(log => console.warn(log));
}

export async function render(file: string): Promise<string> {
  const { default: Page } = await import(dist(file));
  return renderToString(Page());
}

function serverJsPlugin(): BunPlugin {
  return {
    name: "Server JS Plugin",
    async setup(build) {
      build.onLoad({ filter: /\.(tsx)$/ }, async ({ path }) => {
        const contents = await transformReactiveCode(await Bun.file(path).text());
        return { contents, loader: "jsx" };
      });
    },
  };
}
