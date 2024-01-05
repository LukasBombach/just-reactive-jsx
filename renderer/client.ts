import { parse, print } from "@swc/core";
import { replaceJsx } from "../hydration_test/toArray";

import type { BunPlugin } from "bun";

function app(path: string) {
  return "app/" + path + ".tsx";
}

function dist(fileName?: string) {
  return fileName ? "build/server/" + fileName + ".js" : "build/server";
}

export async function compileClientBundle(file: string): Promise<void> {
  const { logs } = await Bun.build({ entrypoints: [app(file)], outdir: "build/client", plugins: [hydraitionCode()] });
  logs.forEach(log => console.warn(log));
}

function hydraitionCode(): BunPlugin {
  return {
    name: "Component Hydration Loader",
    target: "browser",
    async setup(build) {
      build.onLoad({ filter: /\.(tsx)$/ }, async ({ path }) => {
        const program = await parse(await Bun.file(path).text(), { syntax: "typescript", tsx: true });
        await replaceJsx(program);
        const output = await print(program);
        console.log(output.code);
        return { contents: output.code, loader: "jsx" };
      });
    },
  };
}
