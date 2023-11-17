const A = () => <span>A</span>;
const B = () => <span>B</span>;

export default function Counter() {
  let count = 0;

  return (
    <div>
      <input value={count} />
      <button onClick={() => (count = count + 1)}>count</button>
      <br />
      {count % 2 === 0 ? (
        <A />
      ) : (
        <div>
          <p>
            <B />
          </p>
          <img src="https://www.t-online.de/s/paper/_next/static/media/t-online-desktop.0a5256e3.svg" />
        </div>
      )}
    </div>
  );
}
