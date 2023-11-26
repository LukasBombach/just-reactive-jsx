import type { ReactElement, ReactNode } from "react";

export function renderToString(node: ReactNode | (() => ReactNode)): string {
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

      const docType = node.type === "html" ? "<!DOCTYPE html>" : "";

      for (let [key, val] of Object.entries(node.props)) {
        if (typeof val === "function") {
          val = val();
        }

        if (key === "className") {
          key = "class";
        }

        if (key === "children") {
          const vals = Array.isArray(val) ? val : [val];
          children.push(...vals.map(renderToString));
        } else {
          attrs.push(`${key}="${val}"`);
        }
      }

      if (node.props.children) {
        return `${docType}<${[node.type, ...attrs].join(" ")}>${children.join("")}</${node.type}>`;
      } else {
        return `${docType}<${[node.type, ...attrs].join(" ")} />`;
      }
    }

    if (typeof node.type == "function") {
      return renderToString(node.type(node.props));
    }
  }

  if (typeof node === "function") {
    return renderToString(node());
  }

  console.warn(`Cannot handle react element type ${typeof node}`, node);
  return "";
}

function isReactElement(
  val: any
): val is ReactElement<Record<string, unknown>, string | ((props: Record<string, unknown>) => ReactNode)> {
  return typeof val === "object" && val !== null && "type" in val && "props" in val;
}
