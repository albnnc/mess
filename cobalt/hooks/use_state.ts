import { STATE_DATA_KEY } from "../constants.ts";
import {
  Initializer,
  StateUpdate,
  RenderableElement,
  StateSetter,
} from "../types.ts";
import { ensureKey, getInitialValue } from "../utils/mod.ts";
import { useLifecycle } from "./use_lifecycle.ts";
import { useElement } from "./use_element.ts";

export const useState = <T>(initializer: Initializer<T>) => {
  const { requestUpdate } = useLifecycle();
  const element = useElement() as RenderableElement &
    Record<string | number | symbol, unknown>;
  const data = ensureKey(element, STATE_DATA_KEY, initializeData);
  if (!data.listening) {
    data.listening = true;
    element.addEventListener("update", () => {
      data.updates.forEach((v, k) => data.records.set(k, v));
    });
    element.addEventListener("updated", () => {
      data.updates.clear();
      data.index = 0;
    });
  }
  const currentIndex = data.index++;
  if (!data.records.has(currentIndex)) {
    data.records.set(currentIndex, getInitialValue(initializer));
    data.setters.set(currentIndex, (update: StateUpdate<T>) => {
      data.updates.set(
        currentIndex,
        update instanceof Function
          ? data.updates.has(currentIndex)
            ? update(data.updates.get(currentIndex) as T) // FIXME
            : data.records.has(currentIndex)
            ? update(data.records.get(currentIndex) as T) // FIXME
            : update(getInitialValue(initializer))
          : update
      );
      requestUpdate();
    });
  }
  return [
    data.records.get(currentIndex) as T,
    data.setters.get(currentIndex) as StateSetter<T>,
  ] as const;
};

const initializeData = () => ({
  records: new Map<number, unknown>(),
  setters: new Map<number, unknown>(),
  updates: new Map<number, unknown>(),
  index: 0,
  listening: false,
});
