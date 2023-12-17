import { signal } from "@maverick-js/signals";
import { attr } from "./attr";
import { event } from "./event";
import { child } from "./child";

type Hydration = [number, "attr" | "event" | "child", string, any];

function Counter(ssrData: any[]) {
  const count = signal(ssrData[0]);

  return [
    [0, "attr", "value", count],
    [1, "event", "click", () => count.set(count() + 1)],
    [2, "child", "", count],
  ];
}
export function hydrate<D>(Component: (data: D) => Hydration[], ssrData: D) {
  const hydrate = Component(ssrData);
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
