import { signal } from "@maverick-js/signals";
import { el } from "./runtime/el";
import { attr } from "./runtime/attr";
import { event } from "./runtime/event";
import { child } from "./runtime/child";

function hydrate(data: any) {
  return data;
}

function Counter() {
  const count = signal(0); // todo get initial value from ssr

  return [
    [0, "attr", "value", count],
    [1, "event", "click", () => count.set(count() + 1)],
    [2, "set", count],
  ];
}

hydrate(Counter());

// const count = signal(0);
// attr(el(0), "value", count);
// event(el(1), "click", () => count.set(count() + 1));
// child(el(2), count);
