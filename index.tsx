import { signal, effect, tick } from "@maverick-js/signals";
import * as pretty from "pretty-format";
import enableJsDomGlobally from "jsdom-global";

import type { ReactElement } from "react";

enableJsDomGlobally();

const p = (val: unknown) => pretty.format(val, { plugins: [pretty.plugins.DOMElement], highlight: true });

function render(
  { type, props }: ReactElement,
  {
    setAttr,
    setChild,
  }: {
    setAttr: (el: HTMLElement, key: string, val: any) => void;
    setChild: (el: HTMLElement, val: any) => void;
  }
) {
  if (typeof type !== "string") throw new Error("not yet implemented");

  const el = document.createElement(type);

  for (const [key, val] of Object.entries(props)) {
    if (key === "children") {
      const children = Array.isArray(val) ? val : [val];
      children.forEach(child => setChild(el, child));
    } else {
      setAttr(el, key, val);
    }
  }

  return el;
}

const $id = signal("world");
const $text = signal("hello world");

const el = render(
  {
    type: "p",
    key: null,
    props: {
      id: $id,
      children: $text,
    },
  },
  {
    setAttr: (el, key, val) => effect(() => el.setAttribute(key, val())),
    setChild: (el, val) => effect(() => (el.textContent = val())),
  }
);

console.debug(p(el));

console.debug("\n\n✨✨✨\n\n");
$id.set("moon") && $text.set("hello moon") && tick();

console.debug(p(el));
