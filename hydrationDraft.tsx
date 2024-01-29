import { signal, effect } from "@maverick-js/signals";
import { domEffects } from "xx/runtime";

// prettier-ignore
const Counter = (_props: undefined, __ssr_state__: any[]) => {
  const count = signal(__ssr_state__[0]);
  return [
    { children: [count] },
    { onClick: () => count.set(count() + 1) },
  ];
};

// prettier-ignore
const refs = [
  document.querySelector("[r\\:0]")!.nextSibling as Text, // <!-- r:0 -->5<!-- r:0 -->
  document.querySelector("[r\\:1]")!,                     // <button r:1>inc</button>
] as const;

const hydraion = Counter(undefined, [5]);

const CounterX = () => {
  const count = signal(0);
  return [{ children: [count] }, { onClick: () => count.set(count() + 1) }];
};
