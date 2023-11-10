/// <reference lib="dom" />

import { render } from "lib/render";

document.body.appendChild(
  render(
    <main>
      <ul>
        <li>
          <a href="./counter">7 GUIs: Counter</a>
        </li>
      </ul>
    </main>
  )
);
