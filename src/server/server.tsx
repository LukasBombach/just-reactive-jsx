import { plugin } from "bun";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { Document } from "pages/_document";
import { parserPlugin } from "server/parser";
import { extractPlugin } from "server/extractJs";
import { renderToString } from "server/renderToString";

plugin(parserPlugin());

async function getTailwindCss() {
  const tailwind = "@tailwind base;@tailwind components;@tailwind utilities;";
  const processor = postcss([autoprefixer(), tailwindcss(), cssnano()]);
  const result = await processor.process(tailwind, { from: import.meta.path });
  return result.css;
}

async function getClientJs(...entrypoints: string[]) {
  const { outputs, logs } = await Bun.build({ entrypoints, plugins: [extractPlugin({ debug: true })] });

  logs.forEach(log => console.log(log));

  // for (const output of outputs) {
  //   console.log(`✨ ${await output.text()}`);
  // }
}

const server = Bun.serve({
  port: 3000,
  development: true,
  async fetch(req: Request) {
    const upgradeSuccessfully = server.upgrade(req);

    // Check if the request is upgraded successfully
    if (upgradeSuccessfully) {
      // The request was successfully upgraded to a WebSocket connection
      return undefined;
    }

    const url = new URL(req.url);
    const path = url.pathname === "/" ? "../pages/index.tsx" : `../pages${url.pathname}.tsx`;

    if (["/favicon.ico", "/serviceWoker.js"].includes(url.pathname)) {
      return new Response();
    }

    const { default: Page } = await import(path);
    const tailwindCss = await getTailwindCss();

    await getClientJs(`src/server/${path}`);

    // console.log(" - ", 200, path);

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
  websocket: {
    open() {
      // console.log(" - ", "ws", "open");
      // console.log("✨ WebSocket connection opened");
    },
    message() {},
    close() {
      // console.log("✨ WebSocket connection closed");
      // console.log(" - ", "ws", "close");
    },
  },
});

console.log("\n✨ server started at http://localhost:3000\n");
