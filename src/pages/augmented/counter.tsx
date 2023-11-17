export default function Counter() {
  let count = 0;

  return (
    <main>
      <input value={count} />
      <button onClick={() => (count = count + 1)}>count</button>
    </main>
  );
}
