import { EFFECT_DATA_KEY } from "../constants";
import { HookCaller } from "../types";
import { ensureKey } from "../utils";
import { element } from "./element";

export const effect = ($: HookCaller) => {
  return (fn: () => void | (() => void), deps: any[]) => {
    const e = $(element);
    const data = ensureKey(e, EFFECT_DATA_KEY, initializeData);
    const record = ensureKey(data.records, data.index, initializeRecord);
    console.log(record, deps);
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
});

const initializeRecord = () => ({
  deps: undefined,
  clean: undefined,
});
