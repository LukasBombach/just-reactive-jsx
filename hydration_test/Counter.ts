import { signalFromSsr } from "./hydrate";
import type { HydrationFn } from "./hydrate";

export const Counter: HydrationFn<[number]> = () => {
  const count = signalFromSsr(0);

  // prettier-ignore
  return [
    { value: count },
    { onClick: () => count.set(count() + 1) },
    { children: [count] }
  ];
};
