import { signal } from "@maverick-js/signals";
import type { HydrationFn } from "./hydrate";

export const Counter: HydrationFn<[number]> = (_props, initialData) => {
  const count = signal(initialData[0]);

  // prettier-ignore
  return [
    { value: count },
    { onClick: () => count.set(count() + 1) },
    { children: [count] }
  ];
};
