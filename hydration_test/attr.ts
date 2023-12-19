import { effect } from "@maverick-js/signals";

import type { ReadSignal } from "@maverick-js/signals";

export function attr(el: HTMLElement, name: string, signal: ReadSignal<unknown>) {
  if (name === "className") {
    name = "class";
  }

  effect(() => {
    const val = signal();

    // falsy boolean attributes
    if (val === undefined || val === null || val === false) {
      el.removeAttribute(name);

      // style attribute
    } else if (name === "style" && typeof val === "object") {
      Object.entries(val).forEach(([k, v]) => el.style.setProperty(k, v));

      // regular attributes
    } else {
      el.setAttribute(name, String(val));
    }
  });
}
