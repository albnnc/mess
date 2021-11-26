import { stylis } from "../deps.ts";
import { cyrb53 } from "./cyrb53.ts";

const cache = new Map<number, string>();

export function css(statics: TemplateStringsArray, ...args: unknown[]) {
  const style = statics.reduce(
    (p, v, i) => (i < statics.length - 1 ? p + v + args[i] : p + v),
    ""
  );
  const hash = cyrb53(style);
  if (!cache.has(hash)) {
    cache.set(
      hash,
      stylis.serialize(
        stylis.compile(style),
        stylis.middleware([stylis.prefixer, stylis.stringify])
      )
    );
  }
  return cache.get(hash);
}
