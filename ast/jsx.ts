import { findAllByType } from "./find";
import * as is from "./types";

import type * as t from "@swc/types";

export function findEventHandlers(parent: t.Node): t.JSXExpression[] {
  return findAllByType(parent, "JSXAttribute")
    .filter(isEventHandler)
    .map(n => n.value)
    .filter(is.JSXExpressionContainer)
    .map(v => v.expression);
}

function isEventHandler(n: t.JSXAttribute): boolean {
  const name = n.name.type === "Identifier" ? n.name.value : n.name.name.value;
  return Boolean(name.match(/^on[A-Z]/));
}
