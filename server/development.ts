export async function startDevServer() {
  Bun.serve({
    port: 3000,
    development: true,
    async fetch(req: Request) {
      const file = Bun.file("app/index.tsx");
      const text = await file.text();
      return new Response(text);
    },
  });

  console.log("\n🚀 http://localhost:3000\n");
}
