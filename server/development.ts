export async function startDevServer() {
  Bun.serve({
    port: 3000,
    development: true,
    async fetch(req: Request) {
      return new Response(`Hello world`);
    },
  });

  console.log("\n🚀 http://localhost:3000\n");
}
