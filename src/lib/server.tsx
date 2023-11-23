import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { parserPlugin } from "./parser";
import { renderToString } from "./renderToString";

Bun.serve({
  port: 3000,
  development: true,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname === "/" ? "../pages/index.tsx" : `../pages${url.pathname}.tsx`;

    if (["/favicon.ico", "/serviceWoker.js"].includes(url.pathname)) {
      return new Response(null, { status: 200 });
    }

    const { default: Page } = await import(path);

    const collectedCss: string[] = [];

    const bundle = await Bun.build({
      entrypoints: ["src/lib/loader.tsx"],
      define: {
        REQUESTED_PAGE_PATH: JSON.stringify(path),
      },
      plugins: [
        {
          name: "tailwindcss",
          setup: build => {
            build.onLoad({ filter: /\.css$/ }, async args => {
              const css = await Bun.file(args.path).text();
              const processor = postcss([autoprefixer(), tailwindcss(), cssnano()]);
              const result = await processor.process(css, { from: args.path });
              collectedCss.push(result.css);
              return {
                contents: "",
                loader: "ts",
              };
            });
          },
        },
        parserPlugin(),
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
          <title>HERE ${url.pathname}</title>
          <style>${collectedCss.join("")}</style>
        </head>
        <body class="bg-midnight text-moon">
          ${renderToString(<Page />)}
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
