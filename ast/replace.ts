import { traverse } from "ast/traverse";

import type * as t from "@swc/types";

export function replace(container: t.Node, child: t.Node, replacement: t.Node) {
  traverse(container, n => {
    if (Array.isArray(n)) {
      for (let i = 0; i < n.length; i++) {
        if (n[i] === child) {
          n[i] = replacement;
        }
      }
    } else {
      for (const key in n) {
        if (n.hasOwnProperty(key)) {
          // @ts-expect-error TS is dumb
          if (n[key] === child) {
            // @ts-expect-error TS is dumb
            n[key] = replacement;
          }
        }
      }
    }
  });
}
