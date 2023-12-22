import { attr } from "./attr";
import { event } from "./event";
import { child } from "./child";

export type Hydration = JSX.IntrinsicAttributes;
export type HydrationFn<D> = (_props: null, initialData: D) => Hydration[];
export type HydrationData = { component: HydrationFn<any>; refs: string[]; data: any[] };

export function hydrate(hydrationData: HydrationData[]) {
  hydrationData.forEach(({ component, refs, data }) => {
    component(null, data).forEach(([type, name, value], i) => {
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
  });
}
