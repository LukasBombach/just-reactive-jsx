export default function SplitScreen() {
  let split = "50%";

  return (
    <main
      className="grid grid-cols-[var(--split)_1fr] grid-rows-1 h-screen"
      style={{ "--split": split }}
      onMouseMove={e => (split = e.clientX + "px")}
    >
      <div className="h-full">left</div>
      <div className="h-full">right</div>
    </main>
  );
}
