import { signal } from "@maverick-js/signals";
import { attr } from "./attr";
import { event } from "./event";
import { child } from "./child";

import type { WriteSignal } from "@maverick-js/signals";

export type HydrationFn<D> = (_props: null, initialData: D) => Record<string, any>[];
export type HydrationData = { component: HydrationFn<any>; refs: string[]; data: any[] };

export function hydrate(...hydrationData: HydrationData[]) {
  hydrationData.forEach(({ component, refs, data }) => {
    component(null, data).forEach((props, i) => {
      const el = document.querySelector(refs[i]) as HTMLElement;
      Object.entries(props).forEach(([name, value]) => {
        if (name === "children") {
          value.forEach((v: any) => child(el, v));
          return;
        }

        if (name.match(/^on[A-Z]/)) {
          event(el, name.replace(/^on/, "").toLowerCase(), value);
          return;
        }

        attr(el, name, value);
      });
    });
  });
}

export function signalFromSsr(index: number): WriteSignal<any> {
  const initialValue = getValueFromSsrStore(index);
  return signal(initialValue);
}

function getValueFromSsrStore(index: number): any {}
