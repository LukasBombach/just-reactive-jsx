export default function Counter() {
  let count = 0;
  let double = count * 2;

  return (
    <main>
      <input value={double} />
      <button onClick={() => (count = count + 1)}>count</button>
    </main>
  );
}
