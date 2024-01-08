import { parse, print } from "@swc/core";

export async function addHydrationMarkers(input: string): Promise<string> {
  const program = await parse(input, { syntax: "typescript", tsx: true });

  return await print(program).then(o => o.code);
}
