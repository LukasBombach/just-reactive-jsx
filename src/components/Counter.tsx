/**
 * Extract and create a script
 *
 * // all signals
 * const v1 = signal(0)
 *
 * // all elements
 * const e1 = document.querySelector('[data-ref="1"]')
 * const e2 = document.querySelector('[data-ref="2"]')
 *
 * // all attributes / effects
 * effect(() => { input.value = v1() })
 *
 * // all event listeners
 * e2.addEventListener('click', () => { v1.set(v1.get() + 1) })
 */

/**
 * Extract and leave as is
 *
 *   const count = signal(0)
 *
 *   const e1 = document.querySelector('[data-ref="1"]')
 *   effect(() => { e1.value = count() })
 *
 *   const e2 = document.querySelector('[data-ref="2"]')
 *   e2.addEventListener('click', () => { count.set(count.get() + 1) })
 */
export function Counter() {
  let count = 0;

  return (
    <section className="grid grid-rows-1 grid-cols-2 gap-4">
      <input className="text-midnight px-4 py-2 rounded-md" value={count} />
      <button onClick={() => (count = count + 1)}>count: {count}</button>
    </section>
  );
}
