/**
 * <input data-value="count" />
 * <button data-onclick="eventhandler_1">count</button>
 *
 *
 * const count = signal(0)
 *
 * function eventhandler_1() {
 *  count.set(count.get() + 1)
 * }
 *
 * effect(() => {
 *  document.querySelector('[data-value="count"]').value = count()
 * })
 * 
 * document.querySelector('[data-onclick]').forEach((el) => {
 *
 * })

 */
/**
 * <input data-ref="1" value="0" />
 * <button data-ref="2">count </button>
 *
 * const count = signal(0);
 *
 * const refs = {
 *   1: el => effect(() => el.value = count.get())),
 *   2: el => el.addEventListener('click', () => count.set(count.get() + 1))
 * }
 *
 * Object.keys(refs).forEach(key => {
 *  refs[key](document.querySelector(`[data-ref="${key}"]`))
 * })
 *
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
