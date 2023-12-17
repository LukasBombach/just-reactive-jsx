import { signal } from "@maverick-js/signals";
import { attr } from "./attr";
import { event } from "./event";
import { child } from "./child";

type Hydration = [number, "attr" | "event" | "child", string, any];
type HydrationFn<D> = (_props: null, initialData: D) => Hydration[];

export function hydrate<T>(Component: HydrationFn<T>, initialData: T) {
  const hydrate = Component(null, initialData);
  for (const [id, type, name, value] of hydrate) {
    const el = document.querySelector(`r\\:${id}`) as HTMLElement;

    if (type === "attr") {
      attr(el, name, value);
    }

    if (type === "event") {
      event(el, name, value);
    }
    if (type === "child") {
      child(el, value);
    }
  }
}

const Counter: HydrationFn<[number]> = (_props, initialData) => {
  const count = signal(initialData[0]);

  return [
    [0, "attr", "value", count],
    [1, "event", "click", () => count.set(count() + 1)],
    [2, "child", "", count],
  ];
};

hydrate(Counter, [0]);
