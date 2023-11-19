type Type = string | ((props: any) => JSX.Element);
type Props = { [key: string]: any };
type Key = string | number;
type IsStaticChildren = boolean;
type Source = { fileName: string; lineNumber: number; columnNumber: number };
type Self = {};

export function jsxDEV(
  type: Type,
  props: Props | null,
  key: Key,
  isStaticChildren: IsStaticChildren,
  source: Source,
  self: Self
): JSX.Element {
  // Hier kommt Ihre Logik zur Erstellung eines JSX-Elements
  // Dies ist ein einfaches Beispiel, das die übergebenen Informationen nur zurückgibt
  return {
    type,
    props,
    key,
    source,
    self,
  } as JSX.Element;
}
