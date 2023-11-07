import { signal, effect, tick } from "@maverick-js/signals";
import * as pretty from "pretty-format";
import enableJsDomGlobally from "jsdom-global";

import type { ReactElement } from "react";

enableJsDomGlobally();

const p = (val: unknown) => pretty.format(val, { plugins: [pretty.plugins.DOMElement], highlight: true });

function render(
  reactEl: ReactElement,
  options: {
    setAttr: (el: HTMLElement, key: string, val: any) => void;
    insertChild: (parent: HTMLElement, val: any) => void;
  }
) {
  if (typeof reactEl.type !== "string") throw new Error("not yet implemented");

  const el = document.createElement(reactEl.type);

  for (const [key, val] of Object.entries(reactEl.props)) {
    if (key === "children") {
      const children = Array.isArray(val) ? val : [val];
      children.forEach(child => options.insertChild(el, child));
    } else {
      options.setAttr(el, key, val);
    }
  }

  return el;
}

const $id = signal("world");
const $greeting = signal("hello");

const el = render(
  {
    type: "p",
    key: null,
    props: {
      id: $id,
      children: [$greeting, $id],
    },
  },
  {
    setAttr: (el, key, val) => effect(() => el.setAttribute(key, val())),
    insertChild: (parent, val) => {
      const el = document.createTextNode("");
      effect(() => (el.textContent = val()));
      parent.appendChild(el);
    },
  }
);

console.debug(p(el));

console.debug("\n\n✨✨✨\n\n"), $greeting.set("bye"), $id.set("moon"), tick();

console.debug(p(el));
