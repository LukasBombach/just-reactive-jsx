import { parse, print } from "@swc/core";

/**
 * todo maybe use recast
 * @see https://www.npmjs.com/package/recast
 */
export async function transformReactiveCode(input: string): Promise<string> {
  const program = await parse(input, { syntax: "typescript", tsx: true });

  return await print(program).then(o => o.code);
}
