/// <reference lib="dom" />

import { render } from "lib/render";

import type { FC, ReactNode } from "react";

const MyComponent: FC<{ children?: ReactNode }> = ({ children }) => <div>{children}</div>;

document.body.appendChild(render(<MyComponent>hello world</MyComponent>));
