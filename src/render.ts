import type { ReactElement, ReactNode } from "react";

interface Options {
  setAttr: (el: HTMLElement, key: string, val: any) => void;
  insertChild: (parent: HTMLElement, val: ReactNode) => void;
}

export function render(reactEl: ReactElement, options: Options) {
  // wip - only supports html elements
  if (typeof reactEl.type !== "string") {
    throw new Error("not yet implemented");
  }

  // create the element
  const el = document.createElement(reactEl.type);

  // set the props
  for (const [key, val] of Object.entries(reactEl.props)) {
    // special case for children
    if (key === "children") {
      const children = Array.isArray(val) ? val : [val];
      children.forEach(child => options.insertChild(el, child));
    } else {
      options.setAttr(el, key, val);
    }
  }

  return el;
}
