import { plugin } from "bun";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { Document } from "pages/_document";
import { parserPlugin } from "server/parser";
import { renderToString } from "server/renderToString";

plugin(parserPlugin());

async function getTailwindCss() {
  const tailwind = "@tailwind base;@tailwind components;@tailwind utilities;";
  const processor = postcss([autoprefixer(), tailwindcss(), cssnano()]);
  const result = await processor.process(tailwind, { from: import.meta.path });
  return result.css;
}

async function getClientJs(...entrypoints: string[]) {
  const { outputs, logs } = await Bun.build({ entrypoints });

  logs.forEach(log => console.log(log));

  for (const output of outputs) {
    console.log(`✨ ${await output.text()}`);
  }
}

Bun.serve({
  port: 3000,
  development: true,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname === "/" ? "../pages/index.tsx" : `../pages${url.pathname}.tsx`;

    if (["/favicon.ico", "/serviceWoker.js"].includes(url.pathname)) {
      return new Response();
    }

    const { default: Page } = await import(path);
    const tailwindCss = await getTailwindCss();

    console.log(`\n📄 ${path}`);

    await getClientJs(`src/server/${path}`);

    return new Response(
      renderToString(
        <Document criticalCss={tailwindCss}>
          <Page />
        </Document>
      ),
      {
        headers: { "content-type": "text/html; charset=utf-8" },
      }
    );
  },
});

console.log("\n✨ server started at http://localhost:3000");
