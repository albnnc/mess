import { RenderableElement } from "../types.ts";
import { ensureKey } from "../utils/mod.ts";
import { useElement } from "./use_element.ts";

export interface ChainData<T> {
  index: number;
  items: Map<number, T>;
}

export function useChain<T>(
  key: string | number | symbol,
  fn: (prior: T | undefined) => T
) {
  const element = useElement() as RenderableElement &
    Record<string | number | symbol, unknown>;
  const data = ensureKey<ChainData<T>>(element, key, initializeData);
  if (data.index === -1) {
    data.index = 0;
    element.addEventListener("updated", () => (data.index = 0));
  }
  const { items, index } = data;
  const next = fn(items.get(index));
  items.set(index, next);
  data.index++;
  return [next, index, items] as const;
}

function initializeData() {
  return {
    index: -1,
    items: new Map(),
  };
}
