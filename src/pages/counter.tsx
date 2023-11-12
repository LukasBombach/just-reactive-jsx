import { signal } from "@maverick-js/signals";

export default function Counter() {
  const count = signal(0);

  return (
    <div>
      <input value={count} />
      <button onClick={() => count.set(count() + 1)}>count</button>
    </div>
  );
}
