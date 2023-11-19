import "./tailwind.css";

export default function SplitScreen() {
  let splitPoint = 50;

  return (
    <main
      className="grid grid-cols-[calc(var(--split-point)_*_1%)_1fr] grid-rows-1"
      style={{ "--split-point": splitPoint }}
    >
      <div>left</div>
      <div>right</div>
    </main>
  );
}
