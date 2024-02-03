import { parse, print } from "recast";

export async function addHydrationMarkers(input: string): Promise<string> {
  const program = parse(input);

  console.log(program);

  return "";
}

await addHydrationMarkers(`console.log("Hello, World!")`);
