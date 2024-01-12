import { parse, print } from "@swc/core";
import { findEventHandlers } from "ast/jsx";
import { unique } from "ast/filter";
import * as to from "ast/map";

/**
 * todo maybe use recast
 * @see https://www.npmjs.com/package/recast
 */
export async function transformReactiveCode(input: string): Promise<string> {
  const program = await parse(input, { syntax: "typescript", tsx: true });

  const variables = findEventHandlers(program)
    .flatMap(to.Indentifiers)
    .flatMap(to.Declarators.bind(program))
    .filter(unique);

  const usages = variables.flatMap(findUsages);
  const assignments = variables.flatMap(findAssignments);

  variables.forEach(replaceWithSignal);
  usages.forEach(replaceWithGetters);
  assignments.forEach(replaceWithSetters);

  return await print(program).then(o => o.code);
}
