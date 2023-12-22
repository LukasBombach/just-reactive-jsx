import { attr } from "./attr";
import { event } from "./event";
import { child } from "./child";

export type Hydration = ["attr" | "event" | "child", string, any];
export type HydrationFn<D> = (_props: null, initialData: D) => Hydration[];

export function hydrate<T>(Component: HydrationFn<T>, initialData: T, refs: string[]) {
  const hydrate = Component(null, initialData);

  hydrate.forEach(([type, name, value], i) => {
    const el = document.querySelector(refs[i]) as HTMLElement;

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

export function hydrate2(hydrationData: { component: HydrationFn<any>; domRefs: string[]; initialData: any[] }[]) {
  hydrationData.forEach(({ component, initialData, domRefs }) => {
    hydrate(component, initialData, domRefs);
  });
}
