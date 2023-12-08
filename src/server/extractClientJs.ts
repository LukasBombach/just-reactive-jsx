import { Visitor } from "@swc/core/Visitor";
import { parse } from "@swc/core";

import type * as t from "@swc/types";

type AnyNode = t.Program | t.Statement | t.Expression | t.Declaration;
type NodeType = AnyNode["type"];

type AnyNodeOfType<T extends NodeType> = Extract<AnyNode, { type: T }>;
type VisitorName = keyof Visitor;

export async function getClientjs(input: string): string {
  const ast = await parse(input);
  //const extractedCode = findEventHanders(ast);
  const identifiers = NodeFinder.find(ast, "Identifier");

  console.log(identifiers);

  return input;

  // within all event handlers
  // find all identifiers that are not defined in the event handler
  // find their declarations
  // if the declaration is a function declaration, add it to the extracted code
  // if the declaration is a variable declaration, find all references to it
}

function extract(containers: AnyNode[]) {
  const nodes = containers.flatMap(node => NodeFinder.find(node, "Identifier"));

  // find all identifiers within the nodes
  // get their declarations
  // if the declaration is a function declaration, call extract on it
  // if the declaration is a variable declaration, find all references to it
  // for each reference
  // if the reference is a jsx attribute, add it to the extracted code
  // if the reference is a jsx child, add it to the extracted code
  // add a todo for all other cases
}

class NodeFinder extends Visitor {
  private nodes = new Set<AnyNode>();

  public static find(parent: AnyNode, type: NodeType): AnyNodeOfType<NodeType>[] {
    const finder = new NodeFinder();
    return finder.find(parent, type);
  }

  private find(parent: AnyNode, type: NodeType): AnyNodeOfType<NodeType>[] {
    this.nodes.clear();
    this[this.getVisitorName(node)] = (node: AnyNodeOfType<NodeType>) => {
      this.nodes.add(node);
      return node;
    };
    this.visitNode(parent);
    return Array.from(this.nodes);
  }

  private visitNode(node: AnyNode) {
    // @ts-expect-error TypeScript is stupid
    this[this.getVisitorName(node)](node);
  }

  private getVisitorName(node: AnyNode): VisitorName {
    return `visit${node.type.charAt(0).toUpperCase() + node.type.slice(1)}` as VisitorName;
  }
}

/* function findNodesByType<N extends AnyNode, T extends NodeType>(parent: N, type: T): AnyNodeOfType<T>[] {
  const methodName  = `visit${type.charAt(0).toUpperCase() + type.slice(1)}`;

  class NodeFinder<T extends NodeType> extends Visitor {
    public nodes: AnyNodeOfType<T>[] = [];

    constructor(private targetType: T) {
      super();
      (this as any)[methodName] = (node: AnyNode) => {
        if (node.type === this.targetType) {
          this.nodes.push(node as AnyNodeOfType<T>);
        }
      }
    }

  }

}
 */
