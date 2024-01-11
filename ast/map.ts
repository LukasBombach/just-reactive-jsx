import { findAllByType } from "./find";

import type * as t from "@swc/types";

export function Indentifiers(n: t.Node): t.Identifier[] {
  return findAllByType(n, "Identifier");
}

export function Declarators(n: t.Node): t.VariableDeclarator[] {
  return findAllByType(n, "VariableDeclarator");
}
