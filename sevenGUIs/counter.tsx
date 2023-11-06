import { inspect } from "util";
import { signal } from "@maverick-js/signals";

const count = signal(0);

console.log(
  inspect(
    <form>
      <input type="number" value={count} />
      <button onClick={() => count.set(count() + 1)}>count</button>
    </form>,
    { colors: true, depth: Infinity }
  )
);
