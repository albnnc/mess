import { RenderableElement, StateSetter } from "../types.ts";
import { STATE_DATA_KEY } from "../constants.ts";
import { Initializer, StateUpdate } from "../types.ts";
import { ensureKey, getInitialValue } from "../utils/mod.ts";
import { useLifecycle } from "./useLifecycle.ts";
import { useElement } from "./useElement.ts";

export const useState = <T>(initializer: Initializer<T>) => {
  const { requestUpdate } = useLifecycle();
  const element = useElement() as RenderableElement &
    Record<string | number | symbol, unknown>;
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
            ? update(db.updates.get(currentIndex) as T) // FIXME
            : db.records.has(currentIndex)
            ? update(db.records.get(currentIndex) as T) // FIXME
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
  records: new Map<number, unknown>(),
  setters: new Map<number, unknown>(),
  updates: new Map<number, unknown>(),
  index: 0,
  listening: false,
});
