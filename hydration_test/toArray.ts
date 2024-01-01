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
    return identifiers.some(canBeUpdatedByEventHander);
  } else {
    const identifiers = n.value ? getAll<t.Identifier>(n.value, "Identifier") : [];
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

function isCallExpression(n: t.Node): n is t.CallExpression {
  return n.type === "CallExpression";
}

function isMemberExpression(n: t.Node): n is t.MemberExpression {
  return n.type === "MemberExpression";
}

function isIdentifier(n: t.Node): n is t.Identifier {
  return n.type === "Identifier";
}

function isSameIdentifier(a: t.Identifier, b: t.Identifier): boolean {
  return a.value === b.value && a.span.ctxt === b.span.ctxt;
}

function getEventHandlers(node: t.Node): t.JSXExpression[] {
  const eventHandlers: t.JSXExpression[] = [];
  traverseOnly<t.JSXAttribute>(node, "JSXAttribute", n => {
    const name = n.name.type === "Identifier" ? n.name.value : n.name.name.value;
    if (name.match(/^on[A-Z]/) && n.value?.type === "JSXExpressionContainer") {
      eventHandlers.push(n.value.expression);
    }
  });
  return eventHandlers;
}

function getDeclaration(container: t.Node, n: t.Identifier): t.VariableDeclarator | undefined {
  const declarators = getAll<t.VariableDeclarator>(container, "VariableDeclarator");

  for (const d of declarators) {
    if (isIdentifier(d.id) && isSameIdentifier(d.id, n)) {
      return d;
    }
  }
}

function isHasSpan(n: t.Node): n is t.Node & { span: t.Span } {
  return "span" in n;
}

function assertHasSpan(n: t.Node): asserts n is t.Node & { span: t.Span } {
  if (!isHasSpan(n)) throw new Error("assertHasSpan");
}

function bySpan(a: t.Node, b: t.Node): number {
  assertHasSpan(a);
  assertHasSpan(b);
  return a.span.start - b.span.start;
}

/**
 *  --
 */

const code = `
export function Counter() {
  let count = 0;

  return (
    <section className="grid grid-rows-1 grid-cols-2 gap-4">
      <input className="text-midnight px-4 py-2 rounded-md" value={count} />
      <button onClick={() => { count.set(count + 1); count = count + 1; count-- }}>count: {count}</button>
    </section>
  );
}
`;

const preParsed = `
import { signal } from "@maverick-js/signals";

export function Counter() {
  const count = signal(0);

  return (
    <section className="xxx">
      <input className="xxx" value={count} />
      <button onClick={() => count.set(count() + 1)}>count: {count}</button>
    </section>
  );
}`;

const nodes: object[] = [];
const identifiersThatCanBeUpdatedByEventHandler: t.Identifier[] = [];

const ast = await parse(preParsed, { syntax: "typescript", tsx: true });

console.log(
  getEventHandlers(ast)
    .flatMap(n => {
      const callExpressions = getAll<t.CallExpression>(n, "CallExpression");
      const assignments = getAll<t.AssignmentExpression>(n, "AssignmentExpression");
      const updateExpressions = getAll<t.UpdateExpression>(n, "UpdateExpression");
      return [...callExpressions, ...assignments, ...updateExpressions].toSorted(bySpan);
    })
    .flatMap(n => {
      if (isCallExpression(n)) {
        if (isMemberExpression(n.callee) && isIdentifier(n.callee.object)) {
          return getDeclaration(ast, n.callee.object);
        }
      } else {
        console.warn("not implemented", n.type);
      }
    })
);

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
