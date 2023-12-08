import { parse } from "@swc/core";
import { NodeFinder } from "./NodeFinder";

import type { AnyNode } from "./NodeFinder";

export async function extractClientJs(input: string): Promise<string> {
  const ast = await parse(input, { syntax: "typescript", tsx: true });
  const identifiers = NodeFinder.find(ast, "JSXAttribute");

  console.log(identifiers);

  return input;
}

function extract(containers: AnyNode[]) {
  const nodes = NodeFinder.find(containers, "Identifier");

  // find all identifiers within the nodes
  // get their declarations
  // if the declaration is a function declaration, call extract on it
  // if the declaration is a variable declaration, find all references to it
  // for each reference
  // if the reference is a jsx attribute, add it to the extracted code
  // if the reference is a jsx child, add it to the extracted code
  // add a todo for all other cases
}
