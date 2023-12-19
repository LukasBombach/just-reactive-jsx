import { parse, print } from "@swc/core";
import { Visitor } from "@swc/core/Visitor";

import type * as t from "@swc/types";

console.log(
  await transformClientComponent(`
function Counter() {
  const count = signal(0);

  return (
    <section>
      <input value={count} />
      <button onClick={() => count.set(count() + 1)}>Inc</button>
    </section>
  );
}
`)
);

/**
 * replaces the returned jsx with an array of jsx elements
 * where each item is ab object that only contains the attributes that
 * use a signal. all other attributes are removed and any jsx element
 * that does not use a signal is removed.
 */
export async function transformClientComponent(input: string): Promise<string> {
  const ast = await parse(input, { syntax: "typescript", tsx: true });

  return "";
}
