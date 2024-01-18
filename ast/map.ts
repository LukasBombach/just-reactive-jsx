import { findAll } from "ast/find";
import * as asserts from "ast/assert";
import * as is from "ast/types";

import type * as t from "@swc/types";

export function Indentifiers(n: t.Node): t.Identifier[] {
  return findAll(n, "Identifier");
}

export function Declarators(this: unknown, n: t.Identifier): t.VariableDeclarator {
  asserts.Node(this);
  const declarators = findAll(this, "VariableDeclarator");
  for (const d of declarators) if (isSameIdentifier(d.id, n)) return d;
  throw new Error(`Could not find declarator for ${n}`);
}

export function Usages(this: unknown, n: t.VariableDeclarator): t.Identifier[] {
  asserts.Node(this);
  return findAll(this, "Identifier")
    .filter(i => isSameIdentifier(i, n.id))
    .filter(u => u !== n.id);
}

export function Reads(this: unknown, n: t.VariableDeclarator): t.Identifier[] {
  asserts.Node(this);
  const usages = Usages.bind(this)(n);
  const assignments = findAll(this, "AssignmentExpression");
  const updateExpressions = findAll(this, "UpdateExpression");
  return usages.filter(i => {
    for (const a of assignments) if (a.left === i) return false;
    for (const u of updateExpressions) if (u.argument === i) return false;
    return true;
  });
}

export function Updates(this: unknown, n: t.VariableDeclarator): (t.AssignmentExpression | t.UpdateExpression)[] {
  asserts.Node(this);
  const usages = Usages.bind(this)(n);
  const assignments = findAll(this, "AssignmentExpression");
  const updateExpressions = findAll(this, "UpdateExpression");
  return usages
    .map(i => {
      for (const a of assignments) if (isSameIdentifier(a.left, i)) return a;
      for (const u of updateExpressions) if (isSameIdentifier(u.argument, i)) return u;
      return null;
    })
    .filter(is.NonNullable);
}

function isSameIdentifier(a: t.Node, b: t.Node): boolean {
  return is.Identifier(a) && is.Identifier(b) && a.value === b.value && a.span.ctxt === b.span.ctxt;
}

export function AssignmentExpression(n: t.UpdateExpression): t.AssignmentExpression {
  asserts.Identifier(n.argument);
  return {
    type: "AssignmentExpression",
    span: {
      start: 0,
      end: 0,
      ctxt: 0,
    },
    operator: "=",
    left: {
      type: "Identifier",
      span: {
        start: 0,
        end: 0,
        ctxt: 0,
      },
      value: n.argument.value,
      optional: false,
    },
    right: {
      type: "BinaryExpression",
      span: {
        start: 0,
        end: 0,
        ctxt: 0,
      },
      operator: n.operator === "++" ? "+" : "-",
      left: {
        type: "Identifier",
        span: {
          start: 0,
          end: 0,
          ctxt: 0,
        },
        value: n.argument.value,
        optional: false,
      },
      right: {
        type: "NumericLiteral",
        span: {
          start: 0,
          end: 0,
          ctxt: 0,
        },
        value: 1,
      },
    },
  };
}
