import { hydrate } from "./hydrate";
import { Counter } from "./Counter";

hydrate(Counter, [5], [0, 1, 2]);
hydrate(Counter, [23], [3, 4, 5]);
