import { parse } from "@swc/core";
import { Visitor } from "@swc/core/Visitor";
import { traverse } from "./traverse";

import type * as t from "@swc/types";

export class NodeFinder extends Visitor {
  public nodes: object[] = [];

  visitJSXElement(n: t.JSXElement): t.JSXElement {
    const attrs = n.opening.attributes
      .filter((n): n is t.JSXAttribute => n.type === "JSXAttribute")
      .map(n => {
        const name = n.name.type === "Identifier" ? n.name.value : n.name.name.value;
        const value = n.value?.type === "JSXExpressionContainer" ? n.value.expression : undefined;
        return [name, value];
      });
    this.nodes.push(Object.fromEntries(attrs));
    return n;
  }
}

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
  if (typeof n === "object" && n !== null && "type" in n && n.type === "JSXElement") {
    const attrs = n.opening.attributes
      .filter((n): n is t.JSXAttribute => n.type === "JSXAttribute")
      .map(n => {
        const name = n.name.type === "Identifier" ? n.name.value : n.name.name.value;
        const value = n.value?.type === "JSXExpressionContainer" ? n.value.expression : "[…]";
        return [name, value];
      });
    nodes.push(Object.fromEntries(attrs));
  }
});

console.log(nodes);
