import { algo } from "../deps.ts";

export function defineCustomElements(
  elements: Record<string, CustomElementConstructor>
) {
  Object.keys(elements).forEach((k) => {
    if (typeof k !== "string" || k.startsWith("_")) {
      return;
    }
    customElements.define(algo.toKebabCase(k), elements[k]);
  });
}
