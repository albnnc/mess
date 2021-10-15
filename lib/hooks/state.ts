import { STATE_DATA_KEY } from "../constants";
import { HookCaller } from "../types";
import { ensureKey } from "../utils";
import { element } from "./element";
import { lifecycle } from "..";

export const state = ($: HookCaller) => {
  return <T>(initializer: T | (() => T)) => {
    const el = $(element);
    const { requestUpdate } = $(lifecycle);
    const data = ensureKey(el, STATE_DATA_KEY, initializeData);
    if (!data.listening) {
      el.addEventListener("update", () => {
        Object.assign(data.records, data.updates);
        data.updates = {};
        data.index = 0;
      });
      data.listening = true;
    }
    const { records, updates, index } = data;
    const record = ensureKey(records, index, initializer);
    const setRecord = (update: T | ((v: T) => T)) => {
      updates[index] =
        update instanceof Function
          ? Object.prototype.hasOwnProperty.call(updates, index)
            ? update(updates[index])
            : update(record)
          : record;
      requestUpdate();
    };
    data.index++;
    return [record, setRecord] as const;
  };
};

const initializeData = () => ({
  records: {},
  updates: {},
  index: 0,
  listening: false,
});
