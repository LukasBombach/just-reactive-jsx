import { Document } from "./_document";

interface Props {
  criticalCss?: string;
}

export default function Home({ criticalCss }: Props) {
  return (
    <Document criticalCss={criticalCss}>
      <main className="max-w-prose ml-24 mt-16 p-4">
        <header>
          <h1 className="">
            <span className="block font-serif text-6xl leading-[0.8em] [text-shadow:_1px_1px_2px_rgba(10,11,13,.8)] pl-2">
              Unfinished{" "}
            </span>
            <span className="block font-serif text-8xl leading-[0.8em] [text-shadow:_1px_1px_2px_rgba(10,11,13,.8)]">
              Thought
            </span>
          </h1>
        </header>

        <section className="mt-24">
          <header className="uppercase text-sm text-[#13CE66]">Articles</header>

          <a className="block mt-4" href="/syntax-highlighting-with-css-and-a-background-image">
            <h2 className="text-xl font-medium">Syntax highlighting with CSS and a background image</h2>
            <p className="font-thin mt-2 tracking-tight">
              Syntax highlighters generate a ton of markup. This is a proof of concept for using a background image to
              highlight code instead.
            </p>
            <p className="font-medium mt-2">Read more</p>
          </a>

          <a className="block mt-6" href="/counter">
            <h2 className="text-xl font-medium">Counter</h2>
            <p className="font-thin mt-2 tracking-tight">
              This will be the first demo of just-enough-javascript extracted js
            </p>
            <p className="font-medium mt-2">Read more</p>
          </a>
        </section>
      </main>
    </Document>
  );
}
