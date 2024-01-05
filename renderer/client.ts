function app(path: string) {
  return "app/" + path + ".tsx";
}

function dist(fileName?: string) {
  return fileName ? "build/server/" + fileName + ".js" : "build/server";
}

export async function compileClientBundle(file: string): Promise<void> {
  const { logs } = await Bun.build({ entrypoints: [app(file)], outdir: "build/client" });
  logs.forEach(log => console.warn(log));
}
