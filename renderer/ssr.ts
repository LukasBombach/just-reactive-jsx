import { renderToString } from "../src/server/renderToString";

function app(path: string) {
  return "app/" + path;
}

function dist(path: string) {
  return "build/" + path;
}

export async function compileServerBundle(path: string): Promise<void> {
  const { logs } = await Bun.build({ entrypoints: [app(path)], outdir: "build" });
  logs.forEach(log => console.warn(log));
}

export async function render(path: string): Promise<string> {
  const { default: Page } = await import(dist(path));
  return renderToString(Page());
}
