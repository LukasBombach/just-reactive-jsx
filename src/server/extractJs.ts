import { Visitor } from "@swc/core/Visitor";
import { parse, print } from "@swc/core";

import type * as t from "@swc/types";

const span: t.Span = {
  start: 0,
  end: 0,
  ctxt: 0,
};

import type { BunPlugin } from "bun";

/**
 * JSX:
 * The UI should update when variables in the JSX update
 *  - Variables can change through interactivity (event handlers)
 *  - But also other reasons (3rd party libs, other events)
 *  = all assignments could be a target
 *
 * Interactivity:
 * For interactivitiy we need to make event handlers work
 *  - that is code that updates variables in the JSX (reactive stuff)
 *  - but also all other code
 *
 * 2 step process:
 *
 * - find all identifiers inside the jsx
 * - find the declaration, filter const expressions
 *
 * - [optimization for the future = find if there are actual assigments]
 * - [future = objects can be const and still mutate and obj. need fine grained reactivity on props]
 */
export const extractPlugin = (options: { debug?: boolean } = {}): BunPlugin => ({
  name: "extract js",
  async setup(build) {
    build.onLoad({ filter: /src\/(pages|components)\/.+\.tsx$/ }, async ({ path }) => {
      const program = await parse(await Bun.file(path).text(), { syntax: "typescript", tsx: true });

      new MyVisitor().visitProgram(program);

      const { code: contents } = await print(program);

      if (options.debug) {
        // console.debug(`\n\n📄 ${path}\n\n${contents}`);
      }

      return { contents };
    });
  },
});

class MyVisitor extends Visitor {
  visitJSXAttribute(node: t.JSXAttribute) {
    if (node.name.type === "Identifier" && node.name.value.startsWith("on")) {
      console.debug(node.name.value);
    }
    return node;
  }
}
