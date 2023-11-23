import type { ReactElement, ReactNode } from "react";

export function renderToString(node: ReactNode): string {
  if (typeof node === "boolean") {
    return "";
  }

  if (node === null) {
    return "";
  }

  if (typeof node === "undefined") {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return node.toString();
  }

  if (Array.isArray(node)) {
    throw new Error("not yet implemented");
  }

  if (isReactElement(node)) {
    if (typeof node.type === "string") {
      const attrs = [];
      const children = [];

      for (const [key, val] of Object.entries(node.props)) {
        if (key === "children") {
          const vals = Array.isArray(val) ? val : [val];
          children.push(...vals.map(renderToString));
        } else if (key === "className") {
          attrs.push(`class="${val}"`);
        } else {
          attrs.push(`${key}="${val}"`);
        }
      }

      return `<${node.type} ${attrs.join(" ")}>${children.join("")}</${node.type}>`;
    }

    if (typeof node.type == "function") {
      return renderToString(node.type(node.props));
    }
  }

  console.warn(`Cannot handle react element type ${typeof node}`, node);
  return "";
}

function isReactElement(
  val: any
): val is ReactElement<Record<string, unknown>, string | ((props: Record<string, unknown>) => ReactNode)> {
  return typeof val === "object" && val !== null && "type" in val && "props" in val;
}
