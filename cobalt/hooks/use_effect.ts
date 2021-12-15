import { EFFECT_DATA_KEY } from "../constants.ts";
import {
  EffectCallback,
  Deps,
  EffectCleanup,
  RenderableElement,
} from "../types.ts";
import { compareDeps, ensureKey } from "../utils/mod.ts";
import { useElement } from "./use_element.ts";

export const useEffect = (fn: EffectCallback, deps?: Deps) => {
  const element = useElement() as RenderableElement &
    Record<string | number | symbol, unknown>;
  const db = ensureKey(element, EFFECT_DATA_KEY, initializeData);
  if (!db.listening) {
    db.listening = true;
    element.addEventListener("updated", () => {
      db.index = 0;
      for (const v of db.records.values()) {
        if (v.clean && v.fn) {
          v.clean?.();
          delete v.clean;
        }
        const clean = v.fn?.();
        clean && (v.clean = clean);
        delete v.fn;
      }
    });
  }
  const currentIndex = db.index++;
  if (!db.records.has(currentIndex)) {
    db.records.set(currentIndex, { fn, deps });
  } else {
    const record = db.records.get(currentIndex)!; // FIXME
    if (compareDeps(deps, record.deps)) {
      return;
    }
    Object.assign(record, { deps, fn });
  }
};

const initializeData = () => ({
  records: new Map<
    number,
    {
      fn?: EffectCallback;
      clean?: EffectCleanup;
      deps?: Deps;
    }
  >(),
  index: 0,
  listening: false,
});
