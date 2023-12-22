import { attr } from "./attr";
import { event } from "./event";
import { child } from "./child";

export type Hydration = ["attr" | "event" | "child", string, any];
export type HydrationFn<D> = (_props: null, initialData: D) => Hydration[];

export function hydrate(hydrationData: { component: HydrationFn<any>; domRefs: string[]; initialData: any[] }[]) {
  hydrationData.forEach(({ component, initialData, domRefs }) => {
    component(null, initialData).forEach(([type, name, value], i) => {
      const el = document.querySelector(domRefs[i]) as HTMLElement;

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
  });
}
