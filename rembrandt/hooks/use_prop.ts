import { Initializer, RenderableElement } from "../types.ts";
import { useElement } from "./use_element.ts";
import { useState } from "./use_state.ts";
import { useEffect } from "./use_effect.ts";
import { getInitialValue } from "../utils/mod.ts";

export interface PropOptions {
  name: string;
}

export const useProp = <T>(
  initializer: Initializer<T>,
  { name }: PropOptions
) => {
  const element = useElement();
  // TODO: Consider defining getter / setter pair bofore
  // one is able to set properties (e.g. in element constructor)
  // in order to remove this check.
  const [value, setValue] = useState(() =>
    name in element
      ? (element as RenderableElement & Record<string, T>)[name]
      : getInitialValue(initializer)
  );
  useEffect(() => {
    Object.defineProperty(element, name, {
      configurable: true,
      enumerable: true,
      get() {
        return value;
      },
      set(v: T) {
        setValue(() => v);
      },
    });
  }, [value]);
  return [value, setValue] as const;
};
