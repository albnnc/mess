import { toKebabCase } from "./to_kebab_case.ts";

export function registerElements(
  elements: Record<string, CustomElementConstructor>
) {
  Object.keys(elements).forEach((k) => {
    if (typeof k !== "string" || k.startsWith("_")) {
      return;
    }
    customElements.define(toKebabCase(k), elements[k]);
  });
}
