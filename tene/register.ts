import * as elements from "./elements/mod.ts";
import { toKebabCase } from "./utils/mod.ts";

Object.keys(elements).forEach((k) => {
  if (typeof k !== "string" || k.startsWith("_")) {
    return;
  }
  customElements.define(
    toKebabCase(k),
    (elements as Record<string, CustomElementConstructor>)[k]
  );
});
