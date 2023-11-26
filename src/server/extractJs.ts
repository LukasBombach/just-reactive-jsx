import { Visitor } from "@swc/core/Visitor";
import { parse, print } from "@swc/core";

import type {
  AssignmentExpression,
  CallExpression,
  Expression,
  Identifier,
  JSXAttrValue,
  JSXExpressionContainer,
  Node,
  Program,
  Span,
  VariableDeclaration,
  VariableDeclarator,
} from "@swc/types";

const span: Span = {
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
    build.onLoad({ filter: /src\/(pages|components)\/.+\.tsx$/ }, async ({ path, namespace }) => {
      const ast = await parse(await Bun.file(path).text(), { syntax: "typescript", tsx: true });

      const { code: contents } = await print(ast, {
        plugin: program => {
          return program;
        },
      });

      if (options.debug) {
        console.debug(`\n\n📄 ${path}\n\n${contents}`);
      }

      return { contents };
    });
  },
});
