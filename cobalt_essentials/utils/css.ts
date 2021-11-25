import { stylis } from "../deps.ts";

export function css(statics: TemplateStringsArray, ...args: unknown[]) {
  const data = statics.reduce(
    (p, v, i) => (i < statics.length - 1 ? p + v + args[i] : p + v),
    ""
  );
  return stylis.serialize(
    stylis.compile(data),
    stylis.middleware([stylis.prefixer, stylis.stringify])
  );
}
