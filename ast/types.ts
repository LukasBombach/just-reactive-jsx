import type * as t from "@swc/types";

export type AnyNode =
  | t.Program
  | t.Statement
  | t.Expression
  | t.Declaration
  | t.VariableDeclarator
  | t.JSXOpeningElement
  | t.JSXAttribute
  | t.JSXExpressionContainer;

export type NodeType = AnyNode["type"];

export type Nullable<T> = T | null | undefined;

export function NonNullable<T>(t: Nullable<T>): t is T {
  return t !== null && t !== undefined;
}

export function PlainObject(n: unknown): n is object {
  return typeof n === "object" && n !== null && !Array.isArray(n);
}

export function Node(v: unknown): v is t.Node {
  return PlainObject(v) && "type" in v;
}

export function JSXElement(n: Nullable<t.Node>): n is t.JSXElement {
  return n?.type === "JSXElement";
}

export function JSXAttribute(n: Nullable<t.Node>): n is t.JSXAttribute {
  return n?.type === "JSXAttribute";
}

export function JSXExpressionContainer(n: Nullable<t.Node>): n is t.JSXExpressionContainer {
  return n?.type === "JSXExpressionContainer";
}

export function CallExpression(n: Nullable<t.Node>): n is t.CallExpression {
  return n?.type === "CallExpression";
}

export function MemberExpression(n: Nullable<t.Node>): n is t.MemberExpression {
  return n?.type === "MemberExpression";
}

export function Identifier(n: Nullable<t.Node>): n is t.Identifier {
  return n?.type === "Identifier";
}

export function Expression(n: Nullable<t.Node>): n is t.Expression {
  return n?.type === "Expression";
}

export function UpdateExpression(n: Nullable<t.Node>): n is t.UpdateExpression {
  return n?.type === "UpdateExpression";
}

export function AssignmentExpression(n: Nullable<t.Node>): n is t.AssignmentExpression {
  return n?.type === "AssignmentExpression";
}

export function SameIdentifier(a: t.Identifier, b: t.Identifier): boolean {
  return a.value === b.value && a.span.ctxt === b.span.ctxt;
}
