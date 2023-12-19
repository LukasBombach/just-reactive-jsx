import { effect } from "@maverick-js/signals";

import type { ReactElement, ReactNode } from "react";
import type { ReadSignal } from "@maverick-js/signals";

export function child(el: HTMLElement | Text, signal: ReadSignal<unknown>) {
  const parent = el.parentElement!;
  el = el.nextSibling!;

  effect(() => {
    const val = signal();

    if (val === undefined || val === null || val === false) {
      const newEl = document.createTextNode("");
      parent.replaceChild(newEl, el);
      el = newEl;
      return;
    }

    if (typeof val === "string") {
      const newEl = document.createTextNode(val);
      parent.replaceChild(newEl, el);
      el = newEl;
      return;
    }

    if (typeof val === "number") {
      const newEl = document.createTextNode(String(val));
      parent.replaceChild(newEl, el);
      el = newEl;
      return;
    }

    if (Array.isArray(val)) {
      throw new Error("Arrays as children are not yet implemented");
    }

    if (isReactElement(val)) {
      throw new Error("React elements as children are not yet implemented");
    }

    console.error(`Cannot handle child element type ${typeof val}`, val);
    throw new Error(`Cannot handle child element type ${typeof val}`);
  });
}

function isReactElement(
  val: any
): val is ReactElement<Record<string, unknown>, string | ((props: Record<string, unknown>) => ReactNode)> {
  return typeof val === "object" && val !== null && "type" in val && "props" in val;
}
