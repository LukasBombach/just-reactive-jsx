import { parse, print } from "@swc/core";
import { makeJsxAttributesReactive } from "./parser";

import type { BunPlugin } from "bun";

const plugin: BunPlugin = {
  name: "augment reactivity",
  async setup(build) {
    build.onLoad({ filter: /src\/pages\/.+\.tsx$/ }, async ({ path }) => {
      const file = Bun.file(path);
      const contents = await file.text();

      const ast = await parse(contents, { syntax: "typescript", tsx: true });

      makeJsxAttributesReactive(ast);
      const { code: transformedCode } = await print(ast);

      // console.debug(transformedCode);

      // todo string concat is a quick hack to make it work
      return { contents: 'import "lib/tailwind.css";import { signal } from "@maverick-js/signals";' + transformedCode };
    });
  },
};

export default () => plugin;
