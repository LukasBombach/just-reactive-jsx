// server.ts
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = Bun.serve({
  async fetch(req: Request) {
    const url = new URL(req.url);

    // Browser Requests
    if (["/favicon.ico", "/serviceWoker.js"].includes(url.pathname)) {
      return new Response();
    }

    // Index HTML
    if (url.pathname === "/") {
      const indexPath = join(__dirname, "index.html");
      return new Response(Bun.file(indexPath), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Index JS
    if (url.pathname === "/index.js") {
      const { outputs, logs } = await Bun.build({ entrypoints: [join(__dirname, "index.ts")], minify: true });

      logs.forEach(log => console.log(log));

      const [output] = outputs;
      const source = await output.text();

      return new Response(source, {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    // 404 For everything else
    return new Response(null, { status: 404 });
  },
  port: 3000,
});

console.log(`Server running at http://localhost:${server.port}`);
