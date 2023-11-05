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

const $text = signal("Hello World");

// <p>{$text}</p>
// <p>{el => el.textContent = $text()}</p>
// <p>{el => effect(() => { el.textContent = $text() })}</p>
//
// <p>{$text}</p>
// <p>{update => update($text())}</p>
// <p>{update => effect(() => { update($text()) }</p>

// xrender(<p>{$text}</p>, {
//   updateChildren: (el, children) => {
//     el.textContent = children();
//   }
// });

const jsx: JsxElement = {
  type: "p",
  props: {
    children: $text,
  },
};

const el = render(jsx);

print(p(el));

print("\n✨ update ✨\n");

$text.set("Brave new world");
tick();

print(p(el));
