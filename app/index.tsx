export default function Page() {
  let count = 0;

  return (
    <section>
      <input value={count} />
      <button onClick={() => count++}>increase</button>
    </section>
  );
}
