import { signal, effect, tick } from "@maverick-js/signals";
import * as pretty from "pretty-format";
import enableJsDomGlobally from "jsdom-global";

import type { ReactElement } from "react";

enableJsDomGlobally();

const p = (val: unknown) => pretty.format(val, { plugins: [pretty.plugins.DOMElement], highlight: true });

function render({ type, props }: ReactElement) {
  if (typeof type !== "string") throw new Error("not yet implemented");

  const el = document.createElement(type);

  if (props.children) {
    effect(() => {
      el.textContent = props.children();
    });
  }

  return el;
}

const $text = signal("Hello World");

const el = render({
  type: "p",
  key: null,
  props: {
    children: $text,
  },
});

console.debug(p(el));

console.debug("\n✨ update ✨\n");
$text.set("Brave new world") && tick();

console.debug(p(el));
