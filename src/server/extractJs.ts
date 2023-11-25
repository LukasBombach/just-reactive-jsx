/**
 * JSX:
 * The UI should update when variables in the JSX update
 *  - Variables can change through interactivity (event handlers)
 *  - But also other reasons (3rd party libs, other events)
 *  = all assignments could be a target
 *
 * Interactivity:
 * For interactivitiy we need to make event handlers work
 *  - that is code that updates variables in the JSX (reactive stuff)
 *  - but also all other code
 *
 * 2 step process:
 *
 * - find all identifiers inside the jsx
 * - find the declaration, filter const expressions
 *
 * - [optimization for the future = find if there are actual assigments]
 * - [future = objects can be const and still mutate and obj. need fine grained reactivity on props]
 */
function extractJs() {
  // Interactivity: Make Event Handlers wo
  // find all identifiers with jsx
}
