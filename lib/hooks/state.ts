import { StateSetter } from "..";
import { STATE_DATA_KEY } from "../constants";
import { HookCaller, Initializer, StateUpdate } from "../types";
import { ensureKey, getInitialValue } from "../utils";
import { element } from "./element";
import { lifecycle } from "./lifecycle";

export const state = ($: HookCaller) => {
  return <T>(initializer: Initializer<T>) => {
    const { requestUpdate } = $(lifecycle);
    const el = $(element);
    const db = ensureKey(el, STATE_DATA_KEY, initializeData);
    if (!db.listening) {
      db.listening = true;
      el.addEventListener("update", () => {
        db.updates.forEach((v, k) => db.records.set(k, v));
      });
      el.addEventListener("updated", () => {
        db.updates.clear();
        db.index = 0;
      });
    }
    const currentIndex = db.index++;
    if (!db.records.has(currentIndex)) {
      db.records.set(currentIndex, getInitialValue(initializer));
      db.setters.set(currentIndex, (update: StateUpdate<T>) => {
        db.updates.set(
          currentIndex,
          update instanceof Function
            ? db.updates.has(currentIndex)
              ? update(db.updates.get(currentIndex))
              : db.records.has(currentIndex)
              ? update(db.records.get(currentIndex))
              : update(getInitialValue(initializer))
            : update
        );
        requestUpdate();
      });
    }
    return [
      db.records.get(currentIndex) as T,
      db.setters.get(currentIndex) as StateSetter<T>,
    ] as const;
  };
};

const initializeData = () => ({
  records: new Map<number, any>(),
  setters: new Map<number, any>(),
  updates: new Map<number, any>(),
  index: 0,
  listening: false,
});
