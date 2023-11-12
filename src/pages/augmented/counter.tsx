export default function Counter() {
  let count = 0;

  return (
    <div>
      <input value={count} />
      <button onClick={() => count++}>count</button>
    </div>
  );
}
