import { Initializer, CustomElement, StateUpdate } from "../types.ts";
import { useElement } from "./use_element.ts";
import { useState } from "./use_state.ts";
import { getInitialValue } from "../utils/mod.ts";
import { useMemoFn } from "./use_memo_fn.ts";

export const useProp = <T>(name: string, initializer: Initializer<T>) => {
  const element = useElement();
  const defineHandlers = useMemoFn((value: T) => {
    Object.defineProperty(element, name, {
      configurable: true,
      enumerable: true,
      get() {
        return value;
      },
      set(v: T) {
        setProp(() => v);
      },
    });
  }, []);
  const setProp = useMemoFn((update: StateUpdate<T>) => {
    setValue((prior) => {
      const next = update instanceof Function ? update(prior) : update;
      defineHandlers(next);
      return next;
    });
  }, []);
  const [value, setValue] = useState(() => {
    const initialValue =
      // TODO: Consider defining getter / setter pair bofore
      // one is able to set properties (e.g. in element constructor)
      // in order to remove this check.
      name in element
        ? (element as CustomElement<Record<string, T>>)[name]
        : getInitialValue(initializer);
    defineHandlers(initialValue);
    return initialValue;
  });
  return [value, setProp] as const;
};
