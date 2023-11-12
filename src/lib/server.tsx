import { parse, print } from "@swc/core";
import { Visitor } from "@swc/core/Visitor";

import type {
  Module,
  Span,
  JSXAttrValue,
  VariableDeclaration,
  VariableDeclarator,
  Expression,
  CallExpression,
  Identifier,
} from "@swc/types";

// Verwenden Sie einen Dummy-Span, wenn keine spezifische Positionierung erforderlich ist
const dummySpan: Span = {
  start: 0,
  end: 0,
  ctxt: 0,
};

function findIdentifiersInJsxAttributes(ast: Module): Identifier[] {
  const identifiers: Identifier[] = [];

  class FindIdentifiers extends Visitor {
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
        if (declarator.id.type === "Identifier" && declarator.id.value === "count") {
          // Erstelle einen neuen VariableDeclarator für `const count = signal(0);`
          const newDeclarator: VariableDeclarator = {
            ...declarator,
            id: declarator.id, // Behält den bestehenden Identifier bei
            init: this.createSignalCallExpression(declarator.init), // Erstellt einen CallExpression für `signal(0)`
          };

          // Erstelle einen neuen VariableDeclaration-Knoten mit dem neuen Declarator
          return {
            ...variableDeclaration,
            kind: "const", // Ändere 'let' zu 'const'
            declarations: [newDeclarator],
          };
        }
      }
      return variableDeclaration;
    }

    createSignalCallExpression(originalInit: Expression | undefined): CallExpression {
      // Erstellt eine CallExpression für `signal(0)`
      return {
        type: "CallExpression",
        span: dummySpan,
        callee: { type: "Identifier", span: dummySpan, value: "signal", optional: false },
        arguments: originalInit ? [{ expression: { ...originalInit } }] : [],
      };
    }
  }

  new FindIdentifiers().visitProgram(ast);
  new ModifyVariableVisitor().visitProgram(ast);

  return identifiers;
}

/* function findVariableDeclaration(ast: Module, id: string): VariableDeclaration {
  let declaration: VariableDeclaration | undefined;

  class MyVisitor extends Visitor {
    visitVariableDeclaration(d: VariableDeclaration) {
      if (d.declarations[0].id.type === "Identifier" && d.declarations[0].id.value === id) {
        declaration = d;
      }

      return d;
    }
  }

  new MyVisitor().visitProgram(ast);

  if (!declaration) {
    throw new Error(`variable declaration for ${id} not found`);
  }

  return declaration;
} */

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

              const identifiers = findIdentifiersInJsxAttributes(ast);

              const { code: transformedCode } = await print(ast);

              console.log(`${transformedCode}`);

              /* console.log(
                identifiers
                  .map(ident => findVariableDeclaration(ast, ident.value))
                  .map(ident => JSON.stringify(ident, null, 2))
                  .join("\n")
              ); */

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
