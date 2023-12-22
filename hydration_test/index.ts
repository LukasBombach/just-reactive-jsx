import { hydrate } from "./hydrate";
import { Counter } from "./Counter";

const hydrationData = [
  {
    component: Counter,
    domRefs: ["r:0", "r:1", "r:2"],
    initialData: [5],
  },
  {
    component: Counter,
    domRefs: ["r:3", "r:4", "r:5"],
    initialData: [23],
  },
];

hydrate(hydrationData);
