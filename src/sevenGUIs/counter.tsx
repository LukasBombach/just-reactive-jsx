import enableJsDomGlobally from "jsdom-global";
import { signal, effect, tick } from "@maverick-js/signals";
import * as pretty from "pretty-format";
import { render } from "src/render";

import type { ReactElement } from "react";

enableJsDomGlobally();

const p = (val: unknown) => pretty.format(val, { plugins: [pretty.plugins.DOMElement], highlight: true });

const count = signal(0);

const jsx = (
  <form>
    <input type="number" value={count} />
    <button
      onClick={() => {
        console.log("click event handler");
        count.set(count() + 1);
      }}
    >
      count
    </button>
  </form>
);

function isReactElement(val: any): val is ReactElement<Record<string, any>, string> {
  return typeof val === "object" && val !== null && "type" in val && "props" in val;
}

const result = render(jsx, {
  setAttr(el, key, val) {
    if (typeof val === "function") {
      effect(() => el.setAttribute(key, val()));
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
      const el = document.createElement(child.type);

      for (const [key, val] of Object.entries(child.props)) {
        if (key === "children") {
          const children = Array.isArray(val) ? val : [val];
          children.forEach(child => this.insertChild(el, child));
        } else if (key.startsWith("on") && typeof val === "function") {
          const eventName = key.slice(2).toLowerCase();
          el.addEventListener(eventName, val);
        } else {
          this.setAttr(el, key, val);
        }
      }

      parent.appendChild(el);

      return;
    }
  },
});

console.log(jsx);

console.log("\n\n⬇  ⬇  ⬇\n\n");

console.log(p(result));

result
  .querySelector("button")!
  .dispatchEvent(new Event("click", { bubbles: false, cancelable: false, composed: false }));
tick();
console.log("\n\n✨✨ click ✨✨\n\n");

console.log(p(result));
