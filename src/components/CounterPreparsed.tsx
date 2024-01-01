import { signal } from "@maverick-js/signals";

export function Counter() {
  const count = signal(0);

  return (
    <section className="grid grid-rows-1 grid-cols-2 gap-4">
      <input className="text-midnight px-4 py-2 rounded-md" value={count} />
      <button onClick={() => count.set(count() + 1)}>count: {count}</button>
    </section>
  );
}
