import { signal } from "@maverick-js/signals";
import { attr } from "./attr";
import { event } from "./event";
import { child } from "./child";

export type Hydration = ["attr" | "event" | "child", string, any];
export type HydrationFn<D> = (_props: null, initialData: D) => Hydration[];

let globalI = 0;

export function hydrate<T>(Component: HydrationFn<T>, initialData: T) {
  const hydrate = Component(null, initialData);

  for (const [type, name, value] of hydrate) {
    const el = document.querySelector(`[r\\:${globalI}]`) as HTMLElement;

    if (type === "attr") {
      attr(el, name, value);
    }

    if (type === "event") {
      event(el, name, value);
    }

    if (type === "child") {
      child(el, value);
    }

    globalI++;
  }
}
