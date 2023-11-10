/// <reference lib="dom" />

import { signal } from "@maverick-js/signals";
import { render } from "lib/render";

const count = signal(0);

const jsx = (
  <div>
    <input value={count} />
    <button onClick={() => count.set(count() + 1)}>count</button>
  </div>
);

document.body.appendChild(render(jsx));
