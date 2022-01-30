import { EFFECT_DATA_KEY } from "../constants.ts";
import {
  EffectCallback,
  Deps,
  EffectCleanup,
  RenderableElement,
} from "../types.ts";
import { compareDeps, ensureKey } from "../utils/mod.ts";
import { useElement } from "./use_element.ts";

export const useEffect = (fn: EffectCallback, deps?: Deps) => {
  const element = useElement() as RenderableElement &
    Record<string | number | symbol, unknown>;
  const data = ensureKey(element, EFFECT_DATA_KEY, initializeData);
  if (!data.listening) {
    data.listening = true;
    element.addEventListener("updated", () => {
      data.index = 0;
      for (const v of data.records.values()) {
        if (v.clean && v.fn) {
          v.clean?.();
          delete v.clean;
        }
        const clean = v.fn?.();
        clean && (v.clean = clean);
        delete v.fn;
      }
    });
  }
  const currentIndex = data.index++;
  const record = data.records.get(currentIndex);
  if (record) {
    if (!compareDeps(deps, record.deps)) {
      Object.assign(record, { fn, deps });
    }
  } else {
    data.records.set(currentIndex, { fn, deps });
  }
};

const initializeData = () => ({
  records: new Map<
    number,
    {
      fn?: EffectCallback;
      clean?: EffectCleanup;
      deps?: Deps;
    }
  >(),
  index: 0,
  listening: false,
});
