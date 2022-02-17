export function dispatchLocalEvent(el: HTMLElement, event: string) {
  el.dispatchEvent(
    new CustomEvent(event, {
      bubbles: false,
      composed: false,
      cancelable: false,
    })
  );
}
