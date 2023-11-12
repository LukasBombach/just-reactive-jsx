import { parse } from "@swc/core";
import { Visitor } from "@swc/core/Visitor";

import type { JSXAttrValue } from "@swc/types";

class MyVisitor extends Visitor {
  visitJSXAttributeValue(value: JSXAttrValue | undefined) {
    console.log(JSON.stringify(value) + "\n");

    return value;
  }
}

Bun.serve({
  port: 3000,
  development: true,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname === "/" ? "../pages/index.tsx" : `../pages/${url.pathname}.tsx`;

    if (["/favicon.ico", "/serviceWoker.js"].includes(url.pathname)) {
      return new Response(null, { status: 200 });
    }

    const bundle = await Bun.build({
      entrypoints: ["src/lib/pageLoader.tsx"],
      define: {
        REQUESTED_PAGE_PATH: JSON.stringify(path),
      },
      plugins: [
        {
          name: "reactive augmenter",
          async setup(build) {
            build.onLoad({ filter: /src\/pages\/.+\.tsx$/ }, async ({ path }) => {
              const file = Bun.file(path);
              const contents = await file.text();
              console.log(`\n[reactive augmenter]\n\n${path}\n\n${contents}`);

              const ast = await parse(contents, { syntax: "typescript", tsx: true });

              new MyVisitor().visitProgram(ast);

              return { contents };
            });
          },
        },
      ],
    });

    for (const message of bundle.logs) {
      console.error(message);
    }

    const scripts = (await Promise.all(bundle.outputs.map(output => output.text())))
      .map(source => `<script type="module">\n${source}</script>`)
      .join("\n");

    return new Response(
      `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${path}</title>
        </head>
        <body>
          ${scripts}
        </body>
        </html>`,
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      }
    );
  },
});

console.log("\n✨ server started at http://localhost:3000");
