/// <reference lib="dom" />

import { render } from "lib/render";
import { signal } from "@maverick-js/signals";

import type { FC } from "react";

const App: FC = () => {
  const value = signal("value");

  return (
    <main>
      <Input value={value} onInput={event => value.set(event.target.value)} />
      <Input value={value} onInput={event => value.set(event.target.value)} />
    </main>
  );
};

const Input: FC<Pick<JSX.IntrinsicElements["input"], "value" | "onInput">> = ({ value, onInput }) => {
  return <input value={value} onInput={onInput} />;
};

document.body.appendChild(render(<App />));
