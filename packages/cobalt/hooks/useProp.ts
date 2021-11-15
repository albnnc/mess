import { Initializer } from "../types.ts";
import { useElement } from "./useElement.ts";
import { useState } from "./useState.ts";
import { useEffect } from "./useEffect.ts";

export interface PropOptions {
  name: string;
}

export const useProp = <T>(
  initializer: Initializer<T>,
  { name }: PropOptions
) => {
  const element = useElement();
  const [value, setValue] = useState(initializer);
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
