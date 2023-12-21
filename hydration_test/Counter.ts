import { signal } from "@maverick-js/signals";
import type { HydrationFn } from "./hydrate";

export const Counter: HydrationFn<[number]> = (_props, initialData) => {
  const count = signal(initialData[0]);

  return [
    ["attr", "value", count],
    ["event", "click", () => count.set(count() + 1)],
    ["child", "", count],
  ];
};
