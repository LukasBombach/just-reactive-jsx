export function Counter() {
  let count = 0;

  return (
    <section>
      <input value={count} />
      <button onClick={() => count++}>Increase</button>
    </section>
  );
}
