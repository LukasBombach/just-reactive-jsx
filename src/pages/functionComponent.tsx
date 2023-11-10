/// <reference lib="dom" />

import { render } from "lib/render";

import type { FC, ReactNode } from "react";

const Container: FC<{ children?: ReactNode }> = ({ children }) => {
  return <main>{children}</main>;
};

const Input: FC<{ disabled?: boolean; value?: string }> = ({ disabled, value }) => {
  return <input disabled={disabled} value={value} />;
};

document.body.appendChild(
  render(
    <Container>
      This is an input: <Input value="test" />
    </Container>
  )
);