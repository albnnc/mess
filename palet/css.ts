import { algo, stylis } from "./deps.ts";

const cache = new Map<number, string>();
const completeStyleRegExp = /^.[^:]*\{(.|\s)+\}$/gm;

export function css(statics: TemplateStringsArray, ...args: unknown[]) {
  const raw = statics
    .reduce((p, v, i) => (i < statics.length - 1 ? p + v + args[i] : p + v), "")
    .trim();
  const hash = algo.cyrb53(raw);
  if (!cache.has(hash)) {
    const complete = raw.match(completeStyleRegExp);
    let style = complete ? raw : `[&]{${raw}}`;
    style = stylis.serialize(
      stylis.compile(style),
      stylis.middleware([stylis.prefixer, stylis.stringify])
    );
    if (!complete) {
      style = style.replaceAll("[&]", "&");
    }
    cache.set(hash, style);
  }
  return cache.get(hash)!;
}
