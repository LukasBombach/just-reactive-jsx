export function getClientjs(input: string): string {
  const ast = parse(input);
  const extractedCode = findEventHanders(ast);

  // within all event handlers
  // find all identifiers that are not defined in the event handler
  // find their declarations
  // if the declaration is a function declaration, add it to the extracted code
  // if the declaration is a variable declaration, find all references to it
}

/* export function getClientjs(input: string) {
  const eventHanders = findEventHanders(input);
  const dependencies: Node[] = [];

  let newDependencies = findDependencies(eventHanders);
  while (newDependencies.length > 0) {
    dependencies.push(...newDependencies);
    newDependencies = findDependencies(newDependencies);
  }

  mark(eventHanders);
  mark(dependencies);
} */

// function findEventHanders(): Node[] {}
// function findDependencies() {}
// function findEffects() {}
