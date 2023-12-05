export function getClientjs(input: string): string {
  const ast = parse(input);
  const extractedCode = findEventHanders(ast);

  // within all event handlers
  // find all identifiers that are not defined in the event handler
  // find their declarations
  // if the declaration is a function declaration, add it to the extracted code
  // if the declaration is a variable declaration, find all references to it
}

function extract(nodes: Node[]) {
  // find all identifiers within the nodes
  // get their declarations
  // if the declaration is a function declaration, call extract on it
  // if the declaration is a variable declaration, find all references to it
  // for each reference
  // if the reference is a jsx attribute, add it to the extracted code
  // if the reference is a jsx child, add it to the extracted code
  // add a todo for all other cases
}
