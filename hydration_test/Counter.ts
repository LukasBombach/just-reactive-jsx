import { signal } from "@maverick-js/signals";
import type { HydrationFn } from "./hydrate";

export const Counter: HydrationFn<[number]> = (_props, initialData) => {
  const count = signal(initialData[0]);

  return [
    [0, "attr", "value", count],
    [1, "event", "click", () => count.set(count() + 1)],
    [2, "child", "", count],
  ];
};
