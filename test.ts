import { transformReactiveCode } from "renderer/transformReactiveCode";

const result = await transformReactiveCode(`

export default function Page() {
  let count = 0

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My First App</title>
      </head>
      <body>
        <section>
          <input value={count} />
          <button onClick={() => count++}>increase</button>
        </section>
        <script src="index.js" />
      </body>
    </html>
  );
}`);

console.log(result);
