import { signal } from "@maverick-js/signals";

import type { FC } from "react";

const Input: FC<Pick<JSX.IntrinsicElements["input"], "value" | "onInput">> = ({ value, onInput }) => {
  return <input value={value} onInput={onInput} />;
};

export default function App() {
  const value = signal("value");

  return (
    <main>
      <Input value={value} onInput={event => value.set(event.target.value)} />
      <Input value={value} onInput={event => value.set(event.target.value)} />
    </main>
  );
}
