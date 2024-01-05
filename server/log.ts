import c from "chalk";

export const log = {
  blue: (info: unknown, ...args: unknown[]) => console.log(" -", c.blue(info), ...args),
  green: (info: unknown, ...args: unknown[]) => console.log(" -", c.green(info), ...args),
};
