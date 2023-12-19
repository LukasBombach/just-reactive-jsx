export function event(el: HTMLElement, type: string, listener: EventListenerOrEventListenerObject) {
  el.addEventListener(type, listener);
}
