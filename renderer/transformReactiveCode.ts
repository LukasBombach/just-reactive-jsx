import { parse, print } from "@swc/core";

/**
 * todo maybe use recast
 * @see https://www.npmjs.com/package/recast
 */
export async function transformReactiveCode(input: string): Promise<string> {
  const program = await parse(input, { syntax: "typescript", tsx: true });

  const variables = findEventHandlers(program).flatMap(findIndentifiers).flatMap(findDeclarators);
  const usages = variables.flatMap(findUsages);
  const assignments = variables.flatMap(findAssignments);

  variables.forEach(replaceWithSignal);
  usages.forEach(replaceWithGetters);
  assignments.forEach(replaceWithSetters);

  return await print(program).then(o => o.code);
}
