import { parse } from "@swc/core";
import { traverse } from "./traverse";

import type * as t from "@swc/types";

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

traverse(ast, n => {
  if (isPlainObject(n) && isNode(n) && isJSXElement(n)) {
    const attrs = n.opening.attributes
      .filter(isJSXAttribute)
      .filter(isAffectedByStateUpdates)
      .map(n => {
        const name = n.name.type === "Identifier" ? n.name.value : n.name.name.value;
        const value = n.value;
        return [name, value];
      });
    nodes.push(Object.fromEntries(attrs));
  }
});

function isAffectedByStateUpdates(attr: t.JSXAttribute): boolean {
  // todo
  return true;
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

nodes.forEach(n => {
  console.log("\n--\n");
  console.log(n);
});
