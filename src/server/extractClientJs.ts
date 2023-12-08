import { parse } from "@swc/core";
import { NodeFinder } from "./NodeFinder";

import type * as t from "@swc/types";
import type { AnyNode } from "./NodeFinder";

export async function extractClientJs(input: string): Promise<string> {
  const ast = await parse(input, { syntax: "typescript", tsx: true });
  const jsxAttrs = NodeFinder.find(ast, "JSXAttribute");
  const eventHandlers = jsxAttrs.filter(attr => (attr.name as t.Identifier).value?.match(/^on[A-Z]/));
  const expContainers = NodeFinder.find(eventHandlers, "JSXExpressionContainer");
  const identifiers = NodeFinder.find(expContainers, "Identifier");
  const declarators = getDeclarators(ast, identifiers);
  const usages = getUsages(ast, declarators);

  console.log(usages);

  return input;
}

function getDeclarators(parent: AnyNode, ids: t.Identifier[]) {
  const declarators = NodeFinder.find(parent, "VariableDeclarator");
  return declarators.filter(decl => ids.some(i => decl.id.value === i.value && decl.id.span.ctxt === i.span.ctxt));
}

function getUsages(parent: AnyNode, declarators: t.VariableDeclarator[]) {
  const usages = NodeFinder.find(parent, "Identifier");
  return usages.filter(usage =>
    declarators.some(
      decl => decl.id !== usage && decl.id.value === usage.value && decl.id.span.ctxt === usage.span.ctxt
    )
  );
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
