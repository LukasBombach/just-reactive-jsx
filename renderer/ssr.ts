import { renderToString } from "../src/server/renderToString";

function app(path: string) {
  return "app/" + path + ".tsx";
}

function dist(fileName?: string) {
  return fileName ? "build/server/" + fileName + ".js" : "build/server";
}

export async function compileServerBundle(file: string): Promise<void> {
  const { logs } = await Bun.build({ entrypoints: [app(file)], outdir: dist() });
  logs.forEach(log => console.warn(log));
}

export async function render(file: string): Promise<string> {
  const { default: Page } = await import(dist(file));
  return renderToString(Page());
}
