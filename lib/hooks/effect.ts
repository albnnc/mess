import { EffectCleanup } from "..";
import { EFFECT_DATA_KEY } from "../constants";
import { HookCaller, EffectCallback, Deps } from "../types";
import { ensureKey, getInitialValue } from "../utils";
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
    if (!db.records.has(db.index)) {
      db.records.set(db.index, { fn: () => {} });
    }
    const record = db.records.get(db.index);
    if (
      Array.isArray(deps) &&
      Array.isArray(record.deps) &&
      deps.length === record.deps.length &&
      deps.every((v, i) => v === record.deps[i])
    ) {
      return;
    }
    Object.assign(record, { deps, fn });
    db.index++;
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
