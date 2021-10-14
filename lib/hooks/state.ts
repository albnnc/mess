import { HookCaller } from "../types";
import { STATE_DATA_KEY } from "../constants";
import { ensureKey } from "../utils";
import { element } from "./element";

export const state = ($: HookCaller) => {
  return <T>(initializer: T | (() => T)) => {
    const e = $(element);
    const data = ensureKey(e, STATE_DATA_KEY, initializeStateData);
    const { records, updates, index } = data;
    const record = ensureKey(records, index, initializer);
    const setRecord = (update: T | ((v: T) => T)) => {
      updates[index] =
        update instanceof Function
          ? Object.prototype.hasOwnProperty.call(updates, index)
            ? update(updates[index])
            : update(record)
          : record;
      e.requestUpdate(() => {
        Object.assign(records, updates);
        data.updates = {};
        data.index = 0;
      });
    };
    data.index++;
    return [record, setRecord] as const;
  };
};

const initializeStateData = () => ({
  records: {},
  updates: {},
  index: 0,
});
