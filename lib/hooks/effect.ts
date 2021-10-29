import { EffectCleanup } from "..";
import { EFFECT_DATA_KEY } from "../constants";
import { HookCaller, EffectCallback, Deps } from "../types";
import { ensureKey } from "../utils";
import { element } from "./element";

export const effect = ($: HookCaller) => {
  return (fn: EffectCallback, deps?: Deps) => {
    const el = $(element);
    const db = ensureKey(el, EFFECT_DATA_KEY, initializeData);
    if (!db.listening) {
      db.listening = true;
      el.addEventListener("updated", () => {
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
