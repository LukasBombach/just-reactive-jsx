import { parse, print } from "@swc/core";
import { Visitor } from "@swc/core/Visitor";

import type { Module, Span, JSXAttrValue, VariableDeclaration, FunctionExpression, Identifier } from "@swc/types";

const dummySpan: Span = {
  start: 0,
  end: 0,
  ctxt: 0,
};

function transformJsxAttributes(ast: Module) {
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

Bun.serve({
  port: 3000,
  development: true,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname === "/" ? "../pages/index.tsx" : `../pages/${url.pathname}.tsx`;

    if (["/favicon.ico", "/serviceWoker.js"].includes(url.pathname)) {
      return new Response(null, { status: 200 });
    }

    const bundle = await Bun.build({
      entrypoints: ["src/lib/pageLoader.tsx"],
      define: {
        REQUESTED_PAGE_PATH: JSON.stringify(path),
      },
      plugins: [
        {
          name: "reactive augmenter",
          async setup(build) {
            build.onLoad({ filter: /src\/pages\/.+\.tsx$/ }, async ({ path }) => {
              const file = Bun.file(path);
              const contents = await file.text();
              console.log(`\n[reactive augmenter]\n\n${path}\n\n${contents}`);
              const ast = await parse(contents, { syntax: "typescript", tsx: true });
              transformJsxAttributes(ast);
              const { code: transformedCode } = await print(ast);
              console.log(`${transformedCode}`);
              return { contents };
            });
          },
        },
      ],
    });

    for (const message of bundle.logs) {
      console.error(message);
    }

    const scripts = (await Promise.all(bundle.outputs.map(output => output.text())))
      .map(source => `<script type="module">\n${source}</script>`)
      .join("\n");

    return new Response(
      `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>HERE ${path}</title>
        </head>
        <body>
          ${scripts}
        </body>
        </html>`,
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      }
    );
  },
});

console.log("\n✨ server started at http://localhost:3000");
