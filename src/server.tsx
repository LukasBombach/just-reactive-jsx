Bun.serve({
  port: 3000,
  development: true,
  async fetch(req: Request) {
    const url = new URL(req.url);

    const bundle = await Bun.build({
      entrypoints: [`src/pages${url.pathname}.tsx`],
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
      <title>${url.pathname}</title>
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
