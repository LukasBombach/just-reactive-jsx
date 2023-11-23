import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { Document } from "pages/_document";
import { renderToString } from "server/renderToString";

async function getTailwindCss() {
  const tailwind = "@tailwind base;@tailwind components;@tailwind utilities;";
  const processor = postcss([autoprefixer(), tailwindcss(), cssnano()]);
  const result = await processor.process(tailwind, { from: import.meta.path });
  return result.css;
}

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
    const tailwindCss = await getTailwindCss();

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
