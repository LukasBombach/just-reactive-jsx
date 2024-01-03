import { parse } from "@swc/core";
import { traverse } from "./traverse";

import type * as t from "@swc/types";

const span = { start: 0, end: 0, ctxt: 0 };

function traverseNodes(node: t.Node, callback: (node: t.Node) => void) {
  traverse(node, n => isPlainObject(n) && isNode(n) && callback(n));
}

function traverseOnly<T>(node: t.Node, type: string, callback: (node: T) => void) {
  traverseNodes(node, n => n.type === type && callback(n as T));
}

function getAll<T extends t.Node>(node: t.Node, type: T["type"]): T[] {
  const findings: T[] = [];
  traverseNodes(node, n => n.type === type && findings.push(n as T));
  return findings;
}

function isAffectedByStateUpdates(
  n: t.JSXAttribute | t.JSXExpressionContainer,
  mutatingIdentifiers: t.Identifier[]
): boolean {
  if (n.type === "JSXExpressionContainer") {
    const identifiers = getAll<t.Identifier>(n, "Identifier");
    return identifiers.some(n => mutatingIdentifiers.includes(n));
  } else {
    const identifiers = n.value ? getAll<t.Identifier>(n.value, "Identifier") : [];
    return identifiers.some(n => mutatingIdentifiers.includes(n));
  }
}

function findParent<T extends t.Node>(container: t.Node, child: t.Node, parentType: T["type"]): t.Node | undefined {
  let parent: t.Node | undefined;
  traverseOnly<T>(container, parentType, n => {
    for (const key in n) {
      if (n.hasOwnProperty(key)) {
        if (Array.isArray(n[key])) {
          (n[key] as unknown[]).forEach(c => {
            if (c === child) {
              parent = n;
            }
          });
        } else if (n[key] === child) {
          parent = n;
        }
      }
    }
  });
  return parent;
}

const nodes: object[] = [];
const identifiersThatCanBeUpdatedByEventHandler: t.Identifier[] = [];

function canBeUpdatedByEventHander(n: t.Identifier): boolean {
  return identifiersThatCanBeUpdatedByEventHandler.includes(n);
}

function toEntry(
  n: t.JSXAttribute | t.JSXExpressionContainer
): [string, t.JSXAttrValue | t.JSXExpressionContainer | undefined] {
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
function isExpression(n: t.Node): n is t.Expression {
  return n.type === "Expression";
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

function getDeclarator(container: t.Node, n: t.Identifier): t.VariableDeclarator | undefined {
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

function assertJSXExpressionContainer(n: t.Node): asserts n is t.JSXExpressionContainer {
  if (n.type !== "JSXExpressionContainer") throw new Error("Node should have type JSXExpressionContainer");
}

function assertIdentifier(n: t.Node): asserts n is t.Identifier {
  if (n.type !== "Identifier") throw new Error("Node should have type Identifier");
}
function assertExpression(n: t.Node): asserts n is t.Expression {
  if (n.type !== "Expression") throw new Error("Node should have type Expression");
}

function assertNotNull<T>(n: T | null | undefined): asserts n is T {
  if (n === undefined || n === null) throw new Error(`${String("")} should be defined`);
}

function bySpan(a: t.Node, b: t.Node): number {
  assertHasSpan(a);
  assertHasSpan(b);
  return a.span.start - b.span.start;
}

function nonEmpty<T>(v: T | undefined | null): v is T {
  return v !== undefined && v !== null;
}

function getUsages(container: t.Node, decl: t.VariableDeclarator) {
  const identifiers = getAll<t.Identifier>(container, "Identifier");
  return identifiers.filter(usage => isIdentifier(decl.id) && isSameIdentifier(decl.id, usage));
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

  return count % 2 == 0 ? (
    <section className="xxx">
      <input className="xxx" value={count} />
      <button onClick={() => count.set(count() + 1)}>count: {count}</button>
    </section>
  ) : (
    <button onClick={() => count.set(count() - 1)}>decrease</button>
  );
}`;

replaceJsx(await parse(preParsed, { syntax: "typescript", tsx: true }));
/* 

const ast = await parse(preParsed, { syntax: "typescript", tsx: true });

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
        return getDeclarator(ast, n.callee.object);
      }
    } else {
      console.warn("not implemented", n.type);
    }
  })
  .filter(nonEmpty)
  .flatMap(n => getUsages(ast, n))
  .forEach(n => identifiersThatCanBeUpdatedByEventHandler.push(n));

traverseOnly<t.JSXElement>(ast, "JSXElement", n => {
  const attrs = [...n.opening.attributes.filter(isJSXAttribute), ...n.children.filter(isJSXExpressionContainer)]
    .filter(isAffectedByStateUpdates)
    .map(toEntry);
  nodes.push(Object.fromEntries(attrs));
});

nodes.forEach(n => {
  console.log("\n--\n");
  console.log(n);
}); */

function toHydrationEntry(attrs: t.JSXAttribute[]): t.ObjectExpression {
  return {
    type: "ObjectExpression",
    span,
    properties: attrs.map(n => {
      assertIdentifier(n.name);
      assertNotNull(n.value);
      assertJSXExpressionContainer(n.value);
      return { type: "KeyValueProperty", key: n.name, value: n.value.expression };
    }),
  };
}

function toChildrenJSXAttribute(values: t.JSXExpressionContainer[]): t.JSXAttribute {
  return {
    type: "JSXAttribute",
    span,
    name: { type: "Identifier", span, value: "children", optional: false },
    value: {
      type: "JSXExpressionContainer",
      span,
      expression: {
        type: "ArrayExpression",
        span,
        elements: values
          .map(n => n.expression)
          .filter(isExpression)
          .map(expression => ({ expression })),
      },
    },
  };
}

function getHydrationCodeForJSXElement(n: t.JSXElement, mutatingIdentifiers: t.Identifier[]): t.ArrayExpression {
  const jsxElements = getAll<t.JSXElement>(n, "JSXElement");

  /* jsxElements.map(n => {
    const attrs: [string, t.JSXExpression][] = [
      ...n.opening.attributes.filter(isJSXAttribute),
      toChildrenJSXAttribute(n.children.filter(isJSXExpressionContainer)),
    ]
      .filter(n => isAffectedByStateUpdates(n, mutatingIdentifiers))
      .flatMap<[string, t.JSXExpression]>(n => {
        if (n.type === "JSXAttribute") {
          assertNotNull(n.value);
          if (n.value.type === "JSXExpressionContainer") {
            const name = n.name.type === "Identifier" ? n.name.value : n.name.name.value;
            const expression = n.value.expression;
            return [name, expression] as const;
          }
        }

        throw new Error("unexpected");
      });

    console.log(attrs);
  }); */

  return {
    type: "ArrayExpression",
    span: { start: 0, end: 0, ctxt: 0 },
    elements: jsxElements
      .map(n => {
        return [
          ...n.opening.attributes.filter(isJSXAttribute),
          toChildrenJSXAttribute(n.children.filter(isJSXExpressionContainer)),
        ].filter(n => isAffectedByStateUpdates(n, mutatingIdentifiers));
      })
      .filter(attrs => attrs.length > 0)
      .map(toHydrationEntry)
      .map(n => ({ expression: n })),
  };

  /* const attrs = [...n.opening.attributes.filter(isJSXAttribute), ...n.children.filter(isJSXExpressionContainer)]
    .filter(n => isAffectedByStateUpdates(n, mutatingIdentifiers))
    .map(toEntry);
  return t.arrayExpression(
    attrs.map(([name, value]) => {
      if (value) {
        return t.objectExpression([
          t.objectProperty(t.identifier("name"), t.stringLiteral(name)),
          t.objectProperty(t.identifier("value"), value),
        ]);
      } else {
        return t.objectExpression([t.objectProperty(t.identifier("name"), t.stringLiteral(name))]);
      }
    })
  ); */
}

function replaceJsx(program: t.Program): t.Program {
  // 1. Collect all identifiers that can be mutated by event handlers
  const mutatingIdentifiers: t.Identifier[] = [];

  getEventHandlers(program)
    .flatMap(n => {
      const callExpressions = getAll<t.CallExpression>(n, "CallExpression");
      const assignments = getAll<t.AssignmentExpression>(n, "AssignmentExpression");
      const updateExpressions = getAll<t.UpdateExpression>(n, "UpdateExpression");
      return [...callExpressions, ...assignments, ...updateExpressions].toSorted(bySpan);
    })
    .flatMap(n => {
      if (isCallExpression(n)) {
        if (isMemberExpression(n.callee) && isIdentifier(n.callee.object)) {
          return getDeclarator(program, n.callee.object);
        }
      } else {
        console.warn("not implemented", n.type);
      }
    })
    .filter(nonEmpty)
    .flatMap(n => getUsages(program, n))
    .forEach(n => mutatingIdentifiers.push(n));

  // 2. Find outmost JSX containers
  const outmostJSXElements: t.JSXElement[] = [];

  traverseOnly<t.JSXElement>(program, "JSXElement", n => {
    const parent = findParent<t.JSXElement>(program, n, "JSXElement");
    if (!parent) outmostJSXElements.push(n);
  });

  // 3. Continue with the rest of the code...
  outmostJSXElements.forEach(n => {
    const hydrationCode = getHydrationCodeForJSXElement(n, mutatingIdentifiers);
    console.log(hydrationCode);
  });

  // console.log(
  //   outmostJSXElements.length,
  //   outmostJSXElements.map(n => n.opening.name.value)
  // );

  return program;
}
