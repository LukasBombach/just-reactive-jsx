import type { Server, MatchedRoute } from "bun";
import { renderToString } from "react-dom/server";

// Initialize the FileSystemRouter and point it to your pages directory
const router = new Bun.FileSystemRouter({
  style: "nextjs",
  dir: "src/pages",
  origin: "http://localhost:3000/",
  assetPrefix: "/_next/static/",
});

function handle_tsx(route: MatchedRoute, req: Request, server: Server) {
  const path = route.filePath;
  const Handler = require(path).default;

  const html = renderToString(<Handler />);
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}

Bun.serve({
  port: 3000,
  development: true,
  async fetch(req: Request, server: Server) {
    const url = new URL(req.url);

    const route = router.match(url.pathname);

    if (route) {
      return handle_tsx(route, req, server);
    }

    return new Response("File not found", { status: 404 });
  },
});

console.log("\n✨ server started at http://localhost:3000");
