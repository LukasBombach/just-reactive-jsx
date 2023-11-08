import Bun from "@bun/runtime";
import { FileSystemRouter } from "@bun/router";

// Initialize the FileSystemRouter and point it to your pages directory
const router = new FileSystemRouter({
  style: "nextjs",
  dir: "./src/pages",
  origin: "http://localhost:3000/",
  assetPrefix: "/_next/static/",
});

// Define the server
const server = async (req, res) => {
  const match = router.match(req.url);
  if (match) {
    const { filePath } = match;
    if (filePath) {
      await Bun.serve(res, filePath);
    } else {
      res.statusCode = 404;
      res.end("Not found");
    }
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
};

// Start the server
Bun.Http.start(server, { port: 3000 });
