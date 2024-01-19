export default function Page() {
  let count = 0;

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
          <button onClick={() => count++}>increase</button>
        </section>
        <script type="module" src="hydrate.js" async />
      </body>
    </html>
  );
}
