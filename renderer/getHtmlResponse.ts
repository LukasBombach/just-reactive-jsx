export async function getHtmlResponse(path: string): Promise<string> {
  const { outputs, logs } = await Bun.build({ entrypoints: [path], outdir: "build" });
  const { default: Page } = await import(outputs[0].path);
  logs.forEach(log => console.warn(log));
  console.log(Page());
  return "";
}
