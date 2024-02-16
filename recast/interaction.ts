import { parse, print } from "recast";
import { visit } from "ast-types";
import type { namedTypes, ASTNode } from "ast-types";
import type { NodePath } from "ast-types/node-path";

const source = await Bun.file("app/Counter.tsx").text();
const ast = parse(source);

function getEventHandlers(ast: ASTNode): NodePath<namedTypes.JSXAttribute, any>[] {
  const eventHandlers: NodePath<namedTypes.JSXAttribute, any>[] = [];

  visit(ast, {
    visitJSXAttribute(path) {
      const name = typeof path.node.name.name === "string" ? path.node.name.name : path.node.name.name.name;
      if (name.match(/^on[A-Z]/)) eventHandlers.push(path);
    },
  });

  return eventHandlers;
}
