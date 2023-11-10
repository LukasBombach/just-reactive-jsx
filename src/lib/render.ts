import { effect } from "@maverick-js/signals";

import type { ReactElement, ReactNode } from "react";

interface Options {
  setAttr: (el: HTMLElement, key: string, val: any) => void;
  insertChild: (parent: HTMLElement, val: ReactNode) => void;
}

export function render(reactEl: ReactElement, options: Options = maverickRenderer) {
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

function isReactElement(val: any): val is ReactElement<Record<string, any>, string> {
  return typeof val === "object" && val !== null && "type" in val && "props" in val;
}

const maverickRenderer: Options = {
  setAttr(el, key, val) {
    // Event handlers
    if (key.startsWith("on") && typeof val === "function") {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, val);

      // wip: Reactive attributes
    } else if (typeof val === "function") {
      effect(() => el.setAttribute(key, val()));

      // static attributes
    } else {
      el.setAttribute(key, val);
    }
  },
  insertChild(parent, child) {
    if (typeof child === "boolean") {
      return;
    }

    if (child === null) {
      return;
    }

    if (typeof child === "undefined") {
      return;
    }

    if (typeof child === "string") {
      const el = document.createTextNode("");
      effect(() => ((el.textContent = child), undefined));
      parent.appendChild(el);
      return;
    }

    if (typeof child === "number") {
      const el = document.createTextNode("");
      effect(() => ((el.textContent = child.toString()), undefined));
      parent.appendChild(el);
      return;
    }

    if (Array.isArray(child)) {
      throw new Error("not yet implemented");
    }

    if (isReactElement(child)) {
      const el = render(child, this);
      parent.appendChild(el);
      return;
    }
  },
};
