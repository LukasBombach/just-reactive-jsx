import { parse, print } from "@swc/core";
import { findEventHandlers } from "ast/jsx";
import { findAll } from "ast/find";
import { unique } from "ast/filter";
import * as to from "ast/map";
import * as is from "ast/types";

export async function addHydrationMarkers(input: string): Promise<string> {
  const program = await parse(input, { syntax: "typescript", tsx: true });

  const declarators = findEventHandlers(program)
    .flatMap(to.Indentifiers)
    .flatMap(to.Declarators.bind(program))
    .filter(unique);

  const jsxOpenings = findAll(program, "JSXOpeningElement");

  const usages = declarators.flatMap(to.Usages.bind(program));

  console.log(usages);

  const finalElements = usages
    .flatMap(usage => {
      for (const opening of jsxOpenings) {
        if (
          opening.attributes.filter(is.JSXAttribute).some(attr => {
            const identifiers = findAll(attr, "Identifier");
            console.log(
              identifiers.some(id => is.SameIdentifier(id, usage)),
              identifiers.map(i => i.value)
            );

            return identifiers.some(id => is.SameIdentifier(id, usage));
          })
        ) {
          return opening;
        }

        // todo jsx children
        // console.warn("remember: not teated jsx children yet");
      }
    })
    .filter(is.NonNullable);
  // .filter(unique);

  console.log(finalElements);

  return await print(program).then(o => o.code);
}

Bun.file("app/index.tsx").text().then(addHydrationMarkers);
