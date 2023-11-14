import { Visitor } from "@swc/core/Visitor";

import type { Module, Span, JSXAttrValue, VariableDeclaration, FunctionExpression, Identifier } from "@swc/types";

const dummySpan: Span = {
  start: 0,
  end: 0,
  ctxt: 0,
};

export function transformJsxAttributes(ast: Module) {
  const identifiers: Identifier[] = [];

  class ModifyAndStoreIdentifiers extends Visitor {
    visitJSXAttributeValue(value: JSXAttrValue | undefined) {
      if (value?.type === "JSXExpressionContainer" && value.expression.type === "Identifier") {
        identifiers.push(value.expression);
      }
      return value;
    }
  }

  class ModifyVariableVisitor extends Visitor {
    visitVariableDeclaration(variableDeclaration: VariableDeclaration): VariableDeclaration {
      if (variableDeclaration.declarations.length === 1) {
        const declarator = variableDeclaration.declarations[0];
        if (declarator.id.type === "Identifier" && identifiers.map(i => i.value).includes(declarator.id.value)) {
          return {
            ...variableDeclaration,
            kind: "const",
            declarations: [
              {
                ...declarator,
                init: {
                  type: "CallExpression",
                  span: dummySpan,
                  callee: { type: "Identifier", span: dummySpan, value: "signal", optional: false },
                  arguments: declarator.init ? [{ expression: { ...declarator.init } }] : [],
                },
              },
            ],
          };
        }
      }
      return variableDeclaration;
    }
  }

  new ModifyAndStoreIdentifiers().visitProgram(ast);
  new ModifyVariableVisitor().visitProgram(ast);
}
