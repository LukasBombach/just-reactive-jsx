import { getHtmlResponse } from "../renderer/getHtmlResponse";

export async function startDevServer() {
  Bun.serve({
    port: 3000,
    development: true,
    async fetch(req: Request) {
      const html = await getHtmlResponse("app/index.tsx");
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    },
  });

  console.log("\n🚀 http://localhost:3000\n");
}
