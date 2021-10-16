import { EFFECT_DATA_KEY } from "../constants";
import { HookCaller, EffectCallback, Deps } from "../types";
import { ensureKey } from "../utils";
import { element } from "./element";

export const effect = ($: HookCaller) => {
  return (fn: EffectCallback, deps: Deps) => {
    const el = $(element);
    const data = ensureKey(el, EFFECT_DATA_KEY, initializeData);
    if (!data.listening) {
      el.addEventListener("update", () => {
        data.index = 0;
      });
      data.listening = true;
    }
    const record = ensureKey(data.records, data.index, initializeRecord);
    if (
      Array.isArray(deps) &&
      Array.isArray(record.deps) &&
      deps.every((v, i) => v === record.deps[i])
    ) {
      return;
    }
    Object.assign(record, {
      deps,
      clean: fn(),
    });
    data.index++;
  };
};

const initializeData = () => ({
  records: {},
  index: 0,
  listening: false,
});

const initializeRecord = () => ({
  deps: undefined,
  clean: undefined,
});
