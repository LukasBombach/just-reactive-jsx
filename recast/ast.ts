import { parse, print } from "recast";
import { visit } from "ast-types";

import type { NodePath } from "ast-types/node-path";
import type { namedTypes as T } from "ast-types";

export class Ast {
  private program: NodePath<T.Program>;

  constructor(source: string) {
    this.program = parse(source);
  }

  find<T extends NodeType>(parent: t.Node, type: T): any[] {
    const findings: Extract<AnyNode, { type: T }>[] = [];
    traverseByType(parent, type, n => findings.push(n as Extract<AnyNode, { type: T }>));
    return findings;
  }
}
