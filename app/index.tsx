import { signal } from "@maverick-js/signals";

export default function Page() {
  const count = signal(0);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💪</text></svg>"
        />
        <title>My First App</title>
      </head>
      <body>
        <section>
          <input value={count} />
          <button onClick={() => count.set(count() + 1)}>increase</button>
        </section>
        <script src="index.js" />
      </body>
    </html>
  );
}
