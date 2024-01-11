import * as is from "./types";
import type * as t from "@swc/types";

export function Node(v: unknown): asserts v is t.Node {
  if (!is.Node(v)) throw new Error(`Expected a Node, got ${v}`);
}
