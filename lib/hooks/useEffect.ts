import { EFFECT_DATA_KEY } from "../constants";
import { EffectCallback, Deps, EffectCleanup } from "../types";
import { ensureKey } from "../utils";
import { useElement } from "./useElement";

export const useEffect = (fn: EffectCallback, deps?: Deps) => {
  const element = useElement();
  const db = ensureKey(element, EFFECT_DATA_KEY, initializeData);
  if (!db.listening) {
    db.listening = true;
    element.addEventListener("updated", () => {
      db.index = 0;
      for (const v of db.records.values()) {
        v.clean?.();
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
    const record = db.records.get(currentIndex);
    if (
      Array.isArray(deps) &&
      Array.isArray(record.deps) &&
      deps.length === record.deps.length &&
      deps.every((v, i) => v === record.deps[i])
    ) {
      return;
    }
    Object.assign(record, { deps, fn });
  }
};

const initializeData = () => ({
  records: new Map<
    number,
    {
      fn: EffectCallback;
      clean?: EffectCleanup;
      deps?: Deps;
    }
  >(),
  index: 0,
  listening: false,
});
