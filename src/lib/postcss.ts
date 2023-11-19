import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

import type { BunPlugin } from "bun";

const plugin: BunPlugin = {
  name: "postcss",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async ({ path }) => {
      const source = await Bun.file(path).text();
      const result = await postcss([tailwindcss, autoprefixer]).process(source, { from: path });
      return { contents: result.css };
    });
  },
};

export default () => plugin;
