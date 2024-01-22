import { parse, print } from "@swc/core";
import { transformReactiveCode } from "renderer/transformReactiveCode";
import { replaceJsx } from "../hydration_test/toArray";

import type { BunPlugin } from "bun";

function app(path: string) {
  return "app/" + path + ".tsx";
}

function dist(fileName?: string) {
  return fileName ? "build/server/" + fileName + ".js" : "build/server";
}

export async function compileClientBundle(file: string): Promise<void> {
  const { logs } = await Bun.build({ entrypoints: [app(file)], outdir: "build/client", plugins: [clientJsPlugin()] });
  logs.forEach(log => console.warn(log));
}

function clientJsPlugin(): BunPlugin {
  return {
    name: "Client JS Plugin",
    target: "browser",
    async setup(build) {
      build.onLoad({ filter: /\.(tsx)$/ }, async ({ path }) => {
        const source = await Bun.file(path).text();
        const reactive = await transformReactiveCode(source);
        const program = await parse(reactive, { syntax: "ecmascript", jsx: true });
        await replaceJsx(program);
        const output = await print(program);
        return { contents: output.code, loader: "jsx" };
      });
    },
  };
}
