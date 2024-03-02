import { parse, print } from "recast";
import { visit } from "ast-types";

const source = await Bun.file("app/Counter.tsx").text();
const ast = parse(source);

visit(ast, {
  visitJSXOpeningElement(path) {
    console.log("Opening:", print(path.node).code);
    return false;
  },
});
