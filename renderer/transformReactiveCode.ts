import { parse, print } from "@swc/core";
import { findEventHandlers } from "ast/jsx";
import { replace } from "ast/replace";
import { unique } from "ast/filter";
import * as asserts from "ast/assert";
import * as to from "ast/map";
import * as is from "ast/types";

import type * as t from "@swc/types";

/**
 * todo maybe use recast / ast-types
 * @see https://www.npmjs.com/package/recast
 * @see https://github.com/benjamn/ast-types
 */
export async function transformReactiveCode(input: string): Promise<string> {
  const program = await parse(input, { syntax: "typescript", tsx: true });

  const declarators = findEventHandlers(program)
    .flatMap(to.Indentifiers)
    .flatMap(to.Declarators.bind(program))
    .filter(unique);

  const reads = declarators.flatMap(to.Reads.bind(program));
  const updates = declarators.flatMap(to.Updates.bind(program));

  injectImportToMaverick(program);

  declarators.forEach(replaceWithSignal);
  reads.forEach(replaceWithGetters.bind(program));
  updates.forEach(replaceWithSetters.bind(program));

  return await print(program).then(o => o.code);
}

function replaceWithSignal(n: t.VariableDeclarator) {
  n.init = {
    type: "CallExpression",
    callee: { type: "Identifier", value: "signal", span: { start: 0, end: 0, ctxt: n.span.ctxt }, optional: false },
    arguments: n.init ? [{ expression: n.init }] : [],
    span: { start: 0, end: 0, ctxt: n.span.ctxt },
  };
}

function replaceWithGetters(this: unknown, n: t.Identifier) {
  asserts.Node(this);
  replace(this, n, {
    type: "CallExpression",
    callee: { type: "Identifier", value: n.value, span: { start: 0, end: 0, ctxt: n.span.ctxt }, optional: false },
    arguments: [],
    span: { start: 0, end: 0, ctxt: n.span.ctxt },
  } as t.CallExpression);
}

/**
 * todo x += 1 outputs x.set(1) instead of x.set(x + 1)
 */
function replaceWithSetters(this: unknown, n: t.AssignmentExpression | t.UpdateExpression) {
  const name = is.AssignmentExpression(n) ? n.left : n.argument;

  asserts.Node(this);
  asserts.Identifier(name);

  const expression = is.AssignmentExpression(n)
    ? n.right
    : {
        type: "BinaryExpression",
        span: {
          start: 0,
          end: 0,
          ctxt: n.span.ctxt,
        },
        operator: n.operator === "++" ? "+" : "-",
        left: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            value: name.value,
            span: { start: 0, end: 0, ctxt: n.span.ctxt },
            optional: false,
          },
          arguments: [],
          span: { start: 0, end: 0, ctxt: n.span.ctxt },
        },
        right: {
          type: "NumericLiteral",
          span: {
            start: 0,
            end: 0,
            ctxt: n.span.ctxt,
          },
          value: 1,
        },
      };

  replace(this, n, {
    type: "CallExpression",
    span: {
      start: 0,
      end: 0,
      ctxt: n.span.ctxt,
    },
    callee: {
      type: "MemberExpression",
      span: {
        start: 0,
        end: 0,
        ctxt: n.span.ctxt,
      },
      object: {
        type: "Identifier",
        span: {
          start: 0,
          end: 0,
          ctxt: n.span.ctxt,
        },
        value: name.value,
        optional: false,
      },
      property: {
        type: "Identifier",
        span: {
          start: 0,
          end: 0,
          ctxt: n.span.ctxt,
        },
        value: "set",
        optional: false,
      },
    },
    arguments: [{ expression: expression }],
  } as t.CallExpression);
}

function injectImportToMaverick(program: t.Module) {
  program.body.unshift({
    type: "ImportDeclaration",
    span: {
      start: 0,
      end: 0,
      ctxt: 0,
    },
    specifiers: [
      {
        type: "ImportSpecifier",
        span: {
          start: 0,
          end: 0,
          ctxt: 0,
        },
        local: {
          type: "Identifier",
          span: {
            start: 0,
            end: 0,
            ctxt: 0,
          },
          value: "signal",
          optional: false,
        },
        isTypeOnly: false,
      },
    ],
    source: {
      type: "StringLiteral",
      span: {
        start: 0,
        end: 0,
        ctxt: 0,
      },
      value: "@maverick-js/signals",
    },
    typeOnly: false,
  });
}
