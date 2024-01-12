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

  const usages = variables.flatMap(to.Reads.bind(program));
  const updates = variables.flatMap(to.Updates.bind(program));

  variables.forEach(replaceWithSignal);
  usages.forEach(replaceWithGetters);
  updates.forEach(replaceWithSetters);

  return await print(program).then(o => o.code);
}
