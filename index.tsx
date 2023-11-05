import { signal, effect, tick } from "@maverick-js/signals";
import * as pretty from "pretty-format";
import enableJsDomGlobally from "jsdom-global";

import type { ReactElement } from "react";

enableJsDomGlobally();

const p = (val: unknown) => pretty.format(val, { plugins: [pretty.plugins.DOMElement], highlight: true });

function render({ type, props }: ReactElement) {
  if (typeof type !== "string") throw new Error("not yet implemented");

  const el = document.createElement(type);

  const { children, ...attrs } = props;

  for (const [key, val] of Object.entries(attrs)) {
    effect(() => {
      el.setAttribute(key, val());
    });
  }

  if (props.children) {
    effect(() => {
      el.textContent = props.children();
    });
  }

  return el;
}

const $id = signal("world");
const $text = signal("hello world");

const el = render({
  type: "p",
  key: null,
  props: {
    id: $id,
    children: $text,
  },
});

console.debug(p(el));

console.debug("\n\n✨✨✨\n\n");
$id.set("moon") && $text.set("hello moon") && tick();

console.debug(p(el));
