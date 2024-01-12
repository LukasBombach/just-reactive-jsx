import { findAllByType } from "./find";
import * as asserts from "./assert";
import * as is from "./types";

import type * as t from "@swc/types";

export function Indentifiers(n: t.Node): t.Identifier[] {
  return findAllByType(n, "Identifier");
}

export function Declarators(this: unknown, n: t.Identifier): t.VariableDeclarator {
  asserts.Node(this);

  const declarators = findAllByType(this, "VariableDeclarator");

  for (const d of declarators) if (isSameIdentifier(d.id, n)) return d;

  throw new Error(`Could not find declarator for ${n}`);
}

function isSameIdentifier(a: t.Node, b: t.Node): boolean {
  return is.Identifier(a) && is.Identifier(b) && a.value === b.value && a.span.ctxt === b.span.ctxt;
}
