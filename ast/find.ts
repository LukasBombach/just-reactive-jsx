import { traverseByType } from "./traverse";

import type * as t from "@swc/types";
import type { AnyNode, NodeType } from "./types";

export function findAll<T extends NodeType>(parent: t.Node, type: T): Extract<AnyNode, { type: T }>[] {
  const findings: Extract<AnyNode, { type: T }>[] = [];
  traverseByType(parent, type, n => findings.push(n as Extract<AnyNode, { type: T }>));
  return findings;
}
