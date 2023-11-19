import { effect } from "@maverick-js/signals";

import type { ReactElement, ReactNode } from "react";

interface Options {
  setAttr: (el: HTMLElement, key: string, val: any) => void;
  insertChild: (parent: HTMLElement, val: ReactNode | (() => ReactNode)) => void;
}

export function render(
  //reactEl: ReactElement<Record<string, unknown>, string | ((props: Record<string, unknown>) => ReactNode)>,
  node: ReactNode,
  options: Options = maverickRenderer
): HTMLElement | Text {
  if (typeof node === "boolean") {
    return document.createTextNode(""); // todo find a better idea to return a void element
  }

  if (node === null) {
    return document.createTextNode(""); // todo find a better idea to return a void element
  }

  if (typeof node === "undefined") {
    return document.createTextNode(""); // todo find a better idea to return a void element
  }

  if (typeof node === "string") {
    const el = document.createTextNode("");
    effect(() => ((el.textContent = node), undefined));
    return el;
  }

  if (typeof node === "number") {
    const el = document.createTextNode("");
    effect(() => ((el.textContent = node.toString()), undefined));
    return el;
  }

  if (Array.isArray(node)) {
    throw new Error("not yet implemented");
  }

  if (isReactElement(node)) {
    if (typeof node.type === "string") {
      // create the element
      const el = document.createElement(node.type);

      // set the props
      for (const [key, val] of Object.entries(node.props)) {
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

    if (typeof node.type == "function") {
      return render(node.type(node.props));
    }
  }

  console.warn(`Cannot handle react element type ${typeof node}`, node);
  return document.createTextNode(""); // todo find a better idea to return a void element
}

function isReactElement(
  val: any
): val is ReactElement<Record<string, unknown>, string | ((props: Record<string, unknown>) => ReactNode)> {
  return typeof val === "object" && val !== null && "type" in val && "props" in val;
}

const maverickRenderer: Options = {
  setAttr(el, key, val) {
    // Setting Event handlers
    // todo Removing Event handlers
    if (key.startsWith("on") && typeof val === "function") {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, val);

      // Reactive attributes
    } else if (typeof val === "function") {
      effect(() => el.setAttribute(key, val()));

      // falsy boolean attributes
    } else if (val === undefined || val === null || val === false) {
      el.removeAttribute(key);

      // the className attribute needs special handling
    } else if (key === "className") {
      el.setAttribute("class", val);

      // style attribute
    } else if (key === "style") {
      if (typeof val === "string") {
        el.setAttribute("style", val);
      } else {
        for (const [styleKey, styleVal] of Object.entries(val)) {
          if (typeof styleVal === "function") {
            effect(() => el.style.setProperty(styleKey, styleVal()));
          } else {
            el.style.setProperty(styleKey, styleVal);
          }
        }
      }

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

    if (typeof child === "function") {
      let currentElement: HTMLElement | Text | undefined;
      effect(() => {
        if (!currentElement) {
          currentElement = parent.appendChild(render(child(), this));
        } else {
          const newElement = render(child(), this);
          parent.replaceChild(newElement, currentElement);
          currentElement = newElement;
        }
      });
      return;
    }

    console.warn("Unknown child type", typeof child, child);
  },
};
