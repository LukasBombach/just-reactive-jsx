export function el(id: number): HTMLElement {
  return document.querySelector(`[r\\:${id}]`)!;
}
