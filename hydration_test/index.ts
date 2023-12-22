import { hydrate } from "./hydrate";
import { Counter } from "./Counter";

hydrate([
  {
    component: Counter,
    refs: ["[r\\:0]", "[r\\:1]", "[r\\:2]"],
    data: [5],
  },
  {
    component: Counter,
    refs: ["[r\\:3]", "[r\\:4]", "[r\\:5]"],
    data: [23],
  },
]);
