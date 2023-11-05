import { signal, effect, tick } from "@maverick-js/signals";
import * as pretty from "pretty-format";
import enableJsDomGlobally from "jsdom-global";

enableJsDomGlobally();

interface JsxElement {
  type: keyof JSX.IntrinsicElements;
  props: Record<string, any>;
}

function print(...vals: unknown[]) {
  console.debug(...vals);
}

function p(val: unknown) {
  const options = { plugins: [pretty.plugins.DOMElement], highlight: true };
  return pretty.format(val, options);
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
      el.textContent = props.children();
    });
  }
  return el;
}

const el = render(jsx);

print("before", "\n\n", p(el), "\n\n\n");

$text.set("Brave new world");
tick();

Promise.resolve().then(() => print("after", "\n\n", p(el), "\n\n\n"));
