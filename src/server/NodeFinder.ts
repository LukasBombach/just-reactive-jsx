import { Visitor } from "@swc/core/Visitor";

import type * as t from "@swc/types";

export type AnyNode =
  | t.Program
  | t.Statement
  | t.Expression
  | t.Declaration
  | t.VariableDeclarator
  | t.JSXOpeningElement
  | t.JSXAttribute
  | t.JSXExpressionContainer;
export type NodeType = AnyNode["type"];
export type AnyNodeOfType<T extends NodeType> = Extract<AnyNode, { type: T }>;
type VisitorName = keyof Visitor;

export class NodeFinder extends Visitor {
  private nodes = new Set<AnyNode>();

  public static find<T extends NodeType>(parent: AnyNode | AnyNode[], type: T): AnyNodeOfType<T>[] {
    const finder = new NodeFinder();
    if (Array.isArray(parent)) {
      return parent.flatMap(node => finder.find(node, type));
    }
    return finder.find(parent, type);
  }

  private find<T extends NodeType>(parent: AnyNode, type: T): AnyNodeOfType<T>[] {
    this.nodes.clear();

    // @ts-expect-error TypeScript is stupid
    this[this.getVisitorName(type)] = (node: AnyNodeOfType<NodeType>) => {
      this.nodes.add(node);
      return node;
    };

    this.visitNode(parent);
    return Array.from(this.nodes);
  }

  private visitNode(node: AnyNode) {
    // @ts-expect-error TypeScript is stupid
    this[this.getVisitorName(node.type)](node);
  }

  private getVisitorName(type: NodeType): VisitorName {
    return `visit${type.charAt(0).toUpperCase() + type.slice(1)}` as VisitorName;
  }
}
