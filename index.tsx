import { signal, effect } from "@maverick-js/signals";
import * as pretty from "pretty-format";
import enableJsDomGlobally from "jsdom-global";

enableJsDomGlobally();

interface JsxElement {
  type: keyof JSX.IntrinsicElements;
  props: Record<string, any>;
}

function print(...val: unknown[]) {
  const options = { plugins: [pretty.plugins.DOMElement], highlight: true };
  console.debug(...val.map(v => pretty.format(v, options)));
}

const $text = signal("Hello World");

const jsx: JsxElement = {
  type: "p",
  props: {
    children: $text,
  },
};

function render(element: JsxElement) {
  const { type, props } = element;
  const el = document.createElement(type);
  if (props.children) {
    effect(() => {
      let children = props.children();
      console.debug("render", children);
      el.textContent = children;
    });
  }
  return el;
}

const el = render(jsx);

print("before", el.textContent);

$text.set("Brave new world");

print("after", el.textContent);
