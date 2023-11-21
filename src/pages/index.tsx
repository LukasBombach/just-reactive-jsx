export default function Home() {
  return (
    <main className="max-w-prose ml-24 mt-16 p-4">
      <header>
        <h1 className="">
          <span className="block font-serif leading-[0.8em] [text-shadow:_1px_1px_2px_rgba(10,11,13,.8)] text-6xl">
            Unfinished
          </span>
          <span className="block font-serif leading-[0.8em] [text-shadow:_1px_1px_2px_rgba(10,11,13,.8)] text-8xl">
            Thought
          </span>
        </h1>
      </header>

      <section className="mt-24">
        <header className="uppercase text-sm text-[#13CE66] [text-shadow:_1px_1px_2px_rgba(10,11,13,.1)]">
          Articles
        </header>
        <a className="block mt-4" href="/syntax-highlighting-with-css-and-a-background-image">
          <h2 className="text-2xl font-bold [text-shadow:_1px_1px_2px_rgba(10,11,13,.4)]">
            Syntax highlighting with CSS and a background image
          </h2>
          <p className="font-light mt-2 [text-shadow:_1px_1px_2px_rgba(10,11,13,.2)]">
            Syntax highlighters generate a ton of markup. This is a proof of concept for using a background image to
            highlight code instead.
          </p>
        </a>
      </section>
    </main>
  );
}
