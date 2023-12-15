import { parse } from "@swc/core";
import { NodeFinder } from "./NodeFinder";

import type * as t from "@swc/types";
import type { AnyNode, AnyNodeOfType, NodeType } from "./NodeFinder";

export async function extractClientJs(input: string): Promise<string> {
  const ast = await parse(input, { syntax: "typescript", tsx: true });
  const attrs = NodeFinder.byType(ast, "JSXAttribute");
  const eventHandlers = attrs.filter(attr => (attr.name as t.Identifier).value?.match(/^on[A-Z]/));
  const expContainers = NodeFinder.byType(eventHandlers, "JSXExpressionContainer");
  const identifiers = NodeFinder.byType(expContainers, "Identifier");
  const declarators = getDeclarators(ast, identifiers);
  const usages = getUsages(ast, declarators);

  const extract: AnyNode[] = getCodeToExtract(ast, [...declarators, ...usages]).toSorted(
    // @ts-expect-error too lazy to fix
    (a, b) => a.span.start - b.span.start
  );

  console.log(input);
  console.log(extract);

  return input;
}

function getCodeToExtract(container: AnyNode, nodes: AnyNode[]): AnyNode[] {
  const extract = new Set<AnyNode>();

  nodes.forEach(node => {
    if (node.type === "VariableDeclarator") {
      extract.add(node);
      return;
    }

    if (node.type === "Identifier") {
      const declarator = getParent(container, node, "VariableDeclarator");
      if (declarator) {
        extract.add(declarator);
        return;
      }

      const jsxAttr = getParent(container, node, "JSXAttribute");
      if (jsxAttr) {
        extract.add(jsxAttr);
        return;
      }

      const jsxElement = getParent(container, node, "JSXElement");
      const jsxExpressionContainer = getParent(container, node, "JSXExpressionContainer");
      if (jsxElement && jsxExpressionContainer && jsxElement.children.includes(jsxExpressionContainer)) {
        extract.add(jsxExpressionContainer.expression);
        return;
      }

      console.warn("Unknown parent type for identifier", node);
      return;
    }

    console.warn("Unknown node type", node);
  });

  return [...extract];
}

function getParent<T extends NodeType>(container: AnyNode, node: AnyNode, type: T): AnyNodeOfType<T> | null {
  const possibleParents = getByType(container, type);
  return possibleParents.findLast(parent => NodeFinder.contains(parent, node)) ?? null;
}

function getByType<T extends NodeType>(container: AnyNode, type: T): AnyNodeOfType<T>[] {
  const result = new Set<AnyNodeOfType<T>>();

  const iterate = (obj: AnyNode) => {
    Object.keys(obj).forEach(key => {
      if (key === "type" && obj[key] === type) {
        result.add(obj as AnyNodeOfType<T>);
      }

      // @ts-expect-error too lazy to fix
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // @ts-expect-error too lazy to fix
        iterate(obj[key]);
      }

      // @ts-expect-error too lazy to fix
      if (Array.isArray(obj[key])) {
        // @ts-expect-error too lazy to fix
        obj[key].forEach((item: AnyNode) => iterate(item));
      }
    });
  };

  iterate(container);

  return [...result];
}

function getDeclarators(parent: AnyNode, ids: t.Identifier[]) {
  const declarators = NodeFinder.byType(parent, "VariableDeclarator");
  return declarators.filter(decl =>
    ids.some(i => (decl.id as t.Identifier).value === i.value && (decl.id as t.Identifier).span.ctxt === i.span.ctxt)
  );
}

function getUsages(parent: AnyNode, declarators: t.VariableDeclarator[]) {
  const usages = NodeFinder.byType(parent, "Identifier");
  return usages.filter(usage =>
    declarators.some(
      decl =>
        /* decl.id !== usage && */
        (decl.id as t.Identifier).value === usage.value && (decl.id as t.Identifier).span.ctxt === usage.span.ctxt
    )
  );
}

function extract(containers: AnyNode[]) {
  const nodes = NodeFinder.byType(containers, "Identifier");

  // find all identifiers within the nodes
  // get their declarations
  // if the declaration is a function declaration, call extract on it
  // if the declaration is a variable declaration, find all references to it
  // for each reference
  // if the reference is a jsx attribute, add it to the extracted code
  // if the reference is a jsx child, add it to the extracted code
  // add a todo for all other cases
}
