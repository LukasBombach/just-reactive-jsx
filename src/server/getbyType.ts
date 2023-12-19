import type { AnyNode, AnyNodeOfType, NodeType } from "./NodeFinder";

export function getByType<T extends NodeType>(container: AnyNode, type: T): AnyNodeOfType<T>[] {
  const result = new Set<AnyNodeOfType<T>>();

  const iterate = (obj: AnyNode) => {
    Object.keys(obj).forEach(key => {
      if (key === "type" && obj[key] === type) {
        result.add(obj as AnyNodeOfType<T>);
      }

      // @ts-expect-error too lazy to fix
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // @ts-expect-error too lazy to fix
        iterate(obj[key]);
      }

      // @ts-expect-error too lazy to fix
      if (Array.isArray(obj[key])) {
        // @ts-expect-error too lazy to fix
        obj[key].forEach((item: AnyNode) => iterate(item));
      }
    });
  };

  iterate(container);

  return [...result];
}
