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

      // Find all JsxOpeningElements
      // For each element iterate over attributes
      // If there is an event handler, add the element to a list of all elements
      // Also add the event handler to a list of all event handlers

      // For each event handler, find the code it depends on and add that to the list
      // For each added dependency find the code it depends on and add that to the list

      // Now that we have collected all the code we need for the page, we can
      // create a bundle with just that code.

      const elements = getJsxOpeningElements(program).filter(hasEventHandler);

      for (const el of elements) {
        el.attributes.forEach(attr => {
          if (attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value.startsWith("on")) {
            console.log(attr.name.value);
          }
        });
      }

      const elements2 = new Map<t.JSXOpeningElement, t.JSXAttribute[]>();
      class Elements2Visitor extends Visitor {
        visitJSXOpeningElement(node: t.JSXOpeningElement) {
          const attrs = elements2.get(node) || [];
          for (const attr of node.attributes) {
            if (attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value.startsWith("on")) {
              attrs.push(attr);
            }
          }
          elements2.set(node, attrs);
          return node;
        }
      }
      new Elements2Visitor().visitProgram(program);

      const extracted = await parse(
        Array.from(elements2.entries())
          .map(([el, attrs], i) => {
            return "";
          })
          .join("\n"),
        { syntax: "ecmascript" }
      );

      const { code: contents } = await print(program);
      return { contents };
    });
  },
});

function getJsxOpeningElements(program: t.Program): t.JSXOpeningElement[] {
  const elements = new Set<t.JSXOpeningElement>();
  class MyVisitor extends Visitor {
    visitJSXOpeningElement(node: t.JSXOpeningElement) {
      elements.add(node);
      return node;
    }
  }
  new MyVisitor().visitProgram(program);
  return Array.from(elements);
}

function hasEventHandler(el: t.JSXOpeningElement): boolean {
  return el.attributes.some(
    attr => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value.startsWith("on")
  );
}
