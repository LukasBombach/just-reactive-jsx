export default function Home() {
  return (
    <main className="max-w-screen-md ml-24 mt-12 p-4">
      <h1 className="">
        <span className="block font-serif leading-[0.8em] text-6xl">Unfinished</span>
        <span className="block font-serif leading-[0.8em] text-8xl">Thought</span>
      </h1>
      <ul>
        <li>
          <a href="./counter">Counter</a>
        </li>
        <li>
          <a href="./tailwind">Tailwind</a>
        </li>
        <li>
          <a href="./SplitScreen">SplitScreen</a>
        </li>
      </ul>
    </main>
  );
}
