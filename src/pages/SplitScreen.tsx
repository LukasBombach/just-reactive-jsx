import "./tailwind.css";

export default function SplitScreen() {
  let split = "50%";

  return (
    <main
      className="grid grid-cols-[var(--split)_1fr] grid-rows-1"
      style={{ "--split-point": split }}
      onMouseMove={e => (split = e.clientX + "px")}
    >
      <div>left</div>
      <div>right</div>
    </main>
  );
}
