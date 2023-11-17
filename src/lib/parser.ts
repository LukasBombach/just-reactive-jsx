import { Visitor } from "@swc/core/Visitor";

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

const dummySpan: Span = {
  start: 0,
  end: 0,
  ctxt: 0,
};

export function makeJsxAttributesReactive(ast: Program): void {
  const identifiers: Identifier[] = findAllIdentifiersWithinJsxAttributes(ast);
  const declarators: VariableDeclarator[] = findAllVariableDeclarators(ast, identifiers);
  const usages: Identifier[] = findAllUsagesOfDeclarations(ast, declarators);

  const assignments = takeAssignments(ast, usages);
  const accessors = takeAccessors(ast, usages);

  /**
   * TODO WRONG: instead of finding and transforming all jsxExpressionContainers in one go
   * we should have one method with the rules of selecting containers and another method
   * that transforms the containers
   */
  transformJsxExpressionContainers(ast, accessors);

  transformToSignals(ast, declarators);
  transformToSetters(ast, assignments);
  transformToGetters(ast, accessors);
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

function findAllVariableDeclarators(ast: Program, identifiers: Identifier[]): VariableDeclarator[] {
  const declarations = new Set<VariableDeclarator>();

  class FindVariableDeclarations extends Visitor {
    visitVariableDeclaration(value: VariableDeclaration) {
      if (value.kind === "const") {
        return value;
      }

      value.declarations.forEach(declarator => {
        if (identifiers.some(i => isSameIdentifier(declarator.id, i))) declarations.add(declarator);
      });

      return value;
    }
  }

  new FindVariableDeclarations().visitProgram(ast);

  return Array.from(declarations);
}

function findAllUsagesOfDeclarations(ast: Program, declarators: VariableDeclarator[]): Identifier[] {
  const usages = new Set<Identifier>();

  class FindUsages extends Visitor {
    visitIdentifier(value: Identifier) {
      if (declarators.some(d => isSameIdentifier(d.id, value))) {
        usages.add(value);
      }
      return value;
    }
  }

  new FindUsages().visitProgram(ast);

  return Array.from(usages);
}

function takeAssignments(ast: Program, usages: Identifier[]): Identifier[] {
  const assignments = new Set<Identifier>();

  class FindAssignments extends Visitor {
    visitAssignmentExpression(value: AssignmentExpression) {
      if (value.type === "AssignmentExpression" && isIdentifier(value.left)) {
        assignments.add(value.left);
      }
      return value;
    }
  }

  new FindAssignments().visitProgram(ast);

  return usages.filter(u => assignments.has(u));
}

/**
 * todo reuse other methods to find
 * assignments
 * jsxExpressionContainers
 * declarations
 */
function takeAccessors(ast: Program, usages: Identifier[]): Identifier[] {
  const assignments = new Set<Identifier>();
  const jsxExpressionContainers = new Set<JSXExpressionContainer>();
  const declarations = new Set<VariableDeclarator>();

  class FindVariableDeclarations extends Visitor {
    visitVariableDeclaration(value: VariableDeclaration) {
      if (value.kind === "const") {
        return value;
      }

      value.declarations.forEach(declarator => {
        if (usages.some(i => isSameIdentifier(declarator.id, i))) declarations.add(declarator);
      });

      return value;
    }
  }

  new FindVariableDeclarations().visitProgram(ast);

  class FindJSXExpressionContainers extends Visitor {
    visitJSXExpressionContainer(value: JSXExpressionContainer) {
      jsxExpressionContainers.add(value);
      return value;
    }
  }

  class FindAssignments extends Visitor {
    visitAssignmentExpression(value: AssignmentExpression) {
      if (value.type === "AssignmentExpression" && isIdentifier(value.left)) {
        assignments.add(value.left);
      }
      return value;
    }
  }

  new FindJSXExpressionContainers().visitProgram(ast);
  new FindAssignments().visitProgram(ast);

  const jsxExpressionContainersArr = Array.from(jsxExpressionContainers).map(c => c.expression);
  const declarationsArr = Array.from(declarations).map(d => d.id);

  return usages
    .filter(u => !assignments.has(u))
    .filter(u => !jsxExpressionContainersArr.some(c => c === u))
    .filter(u => !declarationsArr.some(d => d === u));
}

function transformToSignals(ast: Program, declarators: VariableDeclarator[]): void {
  class TransformToSignals extends Visitor {
    visitVariableDeclarator(value: VariableDeclarator): VariableDeclarator {
      if (declarators.includes(value)) {
        return {
          ...value,
          init: {
            type: "CallExpression",
            span: dummySpan,
            callee: { type: "Identifier", span: dummySpan, value: "signal", optional: false },
            arguments: value.init ? [{ expression: value.init }] : [],
          },
        };
      }
      return value;
    }
  }

  new TransformToSignals().visitProgram(ast);
}

function transformToSetters(ast: Program, assignments: Identifier[]): void {
  class TransformToSetters extends Visitor {
    visitAssignmentExpression(value: AssignmentExpression): Expression {
      if (isIdentifier(value.left) && assignments.includes(value.left)) {
        return {
          type: "CallExpression",
          span: dummySpan,
          callee: {
            type: "MemberExpression",
            span: dummySpan,
            object: {
              type: "Identifier",
              span: dummySpan,
              value: value.left.value,
              optional: false,
            },
            property: {
              type: "Identifier",
              span: dummySpan,
              value: "set",
              optional: false,
            },
          },
          arguments: [{ expression: value.right }],
        };
      }
      return value;
    }
  }

  new TransformToSetters().visitProgram(ast);
}

function transformToGetters(ast: Program, accessors: Identifier[]): void {
  class TransformToGetters extends Visitor {
    // @ts-expect-error we can return a CallExpression here, it works
    visitIdentifier(value: Identifier): CallExpression | Identifier {
      if (accessors.includes(value)) {
        return {
          type: "CallExpression",
          span: dummySpan,
          callee: {
            type: "Identifier",
            span: dummySpan,
            value: value.value,
            optional: false,
          },
          arguments: [],
        };
      }
      return value;
    }
  }

  new TransformToGetters().visitProgram(ast);
}

/**
 * TODO WRONG: instead of finding and transforming all jsxExpressionContainers in one go
 * we should have one method with the rules of selecting containers and another method
 * that transforms the containers
 */
function transformJsxExpressionContainers(ast: Program, accessors: Identifier[]): void {
  class TransformJsxExpressionContainers extends Visitor {
    visitJSXExpressionContainer(value: JSXExpressionContainer): JSXExpressionContainer {
      // todo wip shortcut, actually no callable expression should be transformed
      // including identiefiers that reference a function
      if (value.expression.type === "ArrowFunctionExpression") {
        return value;
      }

      if (jsxExpressionContainerIncludesIdentifier(value, accessors)) {
        return {
          ...value,
          expression: {
            type: "ArrowFunctionExpression",
            span: dummySpan,
            params: [],
            body: value.expression,
            async: false,
            generator: false,
          },
        };
      }
      return value;
    }
  }

  new TransformJsxExpressionContainers().visitProgram(ast);
}

function jsxExpressionContainerIncludesIdentifier(
  container: JSXExpressionContainer,
  identifiers: Identifier[]
): boolean {
  let found = false;

  class FindIdentifiers extends Visitor {
    visitIdentifier(value: Identifier) {
      if (identifiers.includes(value)) {
        found = true;
      }
      return value;
    }
  }

  new FindIdentifiers().visitJSXExpressionContainer(container);

  return found;
}

function isIdentifier(node: Node): node is Identifier {
  return node.type === "Identifier";
}

function isSameIdentifier(a: Node, b: Node): boolean {
  return isIdentifier(a) && isIdentifier(b) && a.value === b.value && a.span.ctxt === b.span.ctxt;
}
