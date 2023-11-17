const A = () => <span>A</span>;
const B = () => <span>B</span>;

export default function Counter() {
  let count = 0;

  return (
    <div>
      <input value={count} />
      <button onClick={() => (count = count + 1)}>count</button>
      <br />
      {count % 2 === 0 ? <A /> : <B />}
    </div>
  );
}
