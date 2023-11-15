import { Visitor } from "@swc/core/Visitor";

import type {
  Program,
  Node,
  Span,
  JSXAttrValue,
  VariableDeclaration,
  JSXExpressionContainer,
  Identifier,
} from "@swc/types";

const dummySpan: Span = {
  start: 0,
  end: 0,
  ctxt: 0,
};

export function transformJsxAttributes(ast: Program) {
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

function makeJsxAttributesReactive(ast: Program): void {
  const identifiers: Identifier[] = findAllIdentifiersWithinJsxAttributes(ast);
  const declarations: VariableDeclaration[] = findAllVariableDeclarations(ast, identifiers);
  const usages: Identifier[] = findAllUsagesOfDeclarations(ast, declarations);

  const assignments = takeAssignments(ast, usages);
  const accessors = takeAccessors(ast, usages);

  transformToSignals(ast, declarations);
  transformToSetters(ast, assignments);
  transformToGetters(ast, assignments);
}

function findAllIdentifiersWithinJsxAttributes(ast: Program): Identifier[] {
  const identifiers: Identifier[] = [];

  class FindIdentifiers extends Visitor {
    visitIdentifier(value: Identifier) {
      identifiers.push(value);
      return value;
    }
  }

  class FindJsxAttrValues extends Visitor {
    visitJSXAttributeValue(value: JSXAttrValue | undefined) {
      if (value?.type === "JSXExpressionContainer") {
        new FindIdentifiers().visitJSXExpressionContainer(value);
      }
      return value;
    }
  }

  new FindJsxAttrValues().visitProgram(ast);

  return identifiers;
}

function findAllVariableDeclarations(ast: Program, identifiers: Identifier[]): VariableDeclaration[] {
  const declarations = new Set<VariableDeclaration>();

  class FindVariableDeclarations extends Visitor {
    visitVariableDeclaration(value: VariableDeclaration) {
      if (value.kind === "const") {
        return value;
      }

      value.declarations.forEach(declarator => {
        if (identifiers.some(i => isSameIdentifier(declarator.id, i))) declarations.add(value);
      });

      return value;
    }
  }

  new FindVariableDeclarations().visitProgram(ast);

  return Array.from(declarations);
}

function isIdentifier(node: Node): node is Identifier {
  return node.type === "Identifier";
}

function isSameIdentifier(a: Node, b: Node): boolean {
  return isIdentifier(a) && isIdentifier(b) && a.value === b.value && a.span.ctxt === b.span.ctxt;
}
