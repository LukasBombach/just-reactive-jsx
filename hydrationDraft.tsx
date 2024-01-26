import { signal, effect } from "@maverick-js/signals";
import { domEffects } from "xx/runtime";

// prettier-ignore
const elements = [
  document.querySelector("[r\\:0]")!.nextSibling as Text, // <!-- r:0 -->5<!-- r:0 -->
  document.querySelector("[r\\:1]")!,                     // <button r:1>inc</button>
] as const;

// prettier-ignore
const __ssr_state__ = [
  5,                                                      // initial count state
];

// prettier-ignore
const Counter = () => {
  const count = signal(__ssr_state__[0]);
  return [
    { children: [count] },
    { onClick: () => count.set(count() + 1) },
  ];
};

const count = signal(__ssr_state__[0]);
const inc = () => count.set(count() + 1);

effect(() => {
  elements[0].textContent = String(count());
});
