import { parse } from "@swc/core";
import { traverse } from "./traverse";

import type * as t from "@swc/types";

function traverseNodes(node: t.Node, callback: (node: t.Node) => void) {
  traverse(node, n => isPlainObject(n) && isNode(n) && callback(n));
}

function traverseOnly<T>(node: t.Node, type: string, callback: (node: T) => void) {
  traverseNodes(node, n => n.type === type && callback(n as T));
}

function getAll<T>(node: t.Node, type: string): T[] {
  const findings: T[] = [];
  traverseNodes(node, n => n.type === type && findings.push(n as T));
  return findings;
}

function isAffectedByStateUpdates(n: t.JSXAttribute | t.JSXExpressionContainer): boolean {
  if (n.type === "JSXExpressionContainer") {
    const identifiers = getAll<t.Identifier>(n, "Identifier");
    // console.log("children", identifiers);
    return identifiers.some(canBeUpdatedByEventHander);
  } else {
    const identifiers = n.value ? getAll<t.Identifier>(n.value, "Identifier") : [];
    // const name = n.name.type === "Identifier" ? n.name.value : n.name.name.value;
    // console.log(name, identifiers);
    return identifiers.some(canBeUpdatedByEventHander);
  }
}

function canBeUpdatedByEventHander(n: t.Identifier): boolean {
  return identifiersThatCanBeUpdatedByEventHandler.includes(n);
}

function toEntry(n: t.JSXAttribute | t.JSXExpressionContainer): [string, t.JSXAttrValue | undefined] {
  if (n.type === "JSXExpressionContainer") {
    const name = "children";
    const value = n;
    return [name, value];
  } else {
    const name = n.name.type === "Identifier" ? n.name.value : n.name.name.value;
    const value = n.value;
    return [name, value];
  }
}

function isPlainObject(n: unknown): n is object {
  return typeof n === "object" && n !== null && !Array.isArray(n);
}

function isNode(o: object): o is t.Node {
  return "type" in o;
}

function isJSXElement(n: t.Node): n is t.JSXElement {
  return n.type === "JSXElement";
}

function isJSXAttribute(n: t.Node): n is t.JSXAttribute {
  return n.type === "JSXAttribute";
}

function isJSXExpressionContainer(n: t.Node): n is t.JSXExpressionContainer {
  return n.type === "JSXExpressionContainer";
}

function isIdentifier(n: t.Node): n is t.Identifier {
  return n.type === "Identifier";
}

/**
 *  --
 */

const ast = await parse(
  `
export function Counter() {
  let count = 0;

  return (
    <section className="grid grid-rows-1 grid-cols-2 gap-4">
      <input className="text-midnight px-4 py-2 rounded-md" value={count} />
      <button onClick={() => (count = count + 1)}>count: {count}</button>
    </section>
  );
}
`,
  { syntax: "typescript", tsx: true }
);

const nodes: object[] = [];

const identifiersThatCanBeUpdatedByEventHandler: t.Identifier[] = [];

traverseOnly<t.JSXElement>(ast, "JSXElement", n => {
  const attrs = [...n.opening.attributes.filter(isJSXAttribute), ...n.children.filter(isJSXExpressionContainer)]
    .filter(isAffectedByStateUpdates)
    .map(toEntry);
  nodes.push(Object.fromEntries(attrs));
});

nodes.forEach(n => {
  console.log("\n--\n");
  console.log(n);
});
