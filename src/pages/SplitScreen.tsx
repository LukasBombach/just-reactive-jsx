import "./tailwind.css";

export default function SplitScreen() {
  let splitPoint = 50;

  return (
    <main className="grid grid-cols-[var(--split-point)_1fr] grid-rows-1" style={{ "--split-point": "50%" }}>
      <div>left</div>
      <div>right</div>
    </main>
  );
}
