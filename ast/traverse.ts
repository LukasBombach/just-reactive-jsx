import * as is from "./types";

import type * as t from "@swc/types";
import type { AnyNode, NodeType } from "./types";

export function traverse(parent: t.Node, callback: (node: t.Node) => void) {
  traverseAny(parent, n => is.PlainObject(n) && is.Node(n) && callback(n));
}

export function traverseByType<T extends NodeType>(
  parent: t.Node,
  type: T,
  callback: (node: Extract<AnyNode, { type: T }>) => void
) {
  traverse(parent, n => n.type === type && callback(n as Extract<AnyNode, { type: T }>));
}

function traverseAny(obj: any, callback: (node: any) => void) {
  // Call the callback for the current node
  callback(obj);

  // Traverse its children
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        traverseAny(obj[i], callback);
      }
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          traverseAny(obj[key], callback);
        }
      }
    }
  }
}
