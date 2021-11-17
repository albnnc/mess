import { StateSetter } from "../types";
import { STATE_DATA_KEY } from "../constants";
import { Initializer, StateUpdate } from "../types";
import { ensureKey, getInitialValue } from "../utils";
import { useLifecycle } from "./useLifecycle";
import { useElement } from "./useElement";

export const useState = <T>(initializer: Initializer<T>) => {
  const { requestUpdate } = useLifecycle();
  const element = useElement();
  const db = ensureKey(element, STATE_DATA_KEY, initializeData);
  if (!db.listening) {
    db.listening = true;
    element.addEventListener("update", () => {
      db.updates.forEach((v, k) => db.records.set(k, v));
    });
    element.addEventListener("updated", () => {
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

const initializeData = () => ({
  records: new Map<number, any>(),
  setters: new Map<number, any>(),
  updates: new Map<number, any>(),
  index: 0,
  listening: false,
});
