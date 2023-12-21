import { attr } from "./attr";
import { event } from "./event";
import { child } from "./child";

export type Hydration = ["attr" | "event" | "child", string, any];
export type HydrationFn<D> = (_props: null, initialData: D) => Hydration[];

export function hydrate<T>(Component: HydrationFn<T>, initialData: T, refs: number[]) {
  const hydrate = Component(null, initialData);

  hydrate.forEach(([type, name, value], i) => {
    const el = document.querySelector(`[r\\:${refs[i]}]`) as HTMLElement;

    if (type === "attr") {
      attr(el, name, value);
    }

    if (type === "event") {
      event(el, name, value);
    }

    if (type === "child") {
      child(el, value);
    }
  });
}
