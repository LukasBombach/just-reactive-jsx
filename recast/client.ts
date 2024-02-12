import { parse, print } from "recast";
import { visit } from "ast-types";

const source = await Bun.file("app/Counter.tsx").text();
const ast = parse(source);

visit(ast, {
  visitJSXAttribute(path) {
    console.log(print(path.parent).code);

    if (path.node.value) {
      visit(path.node.value, {
        visitIdentifier(path) {
          this.console.log(print(path.node).code);
          return false;
        },
      });
    }

    return false;
  },
});
