import { Initializer } from "../types";
import { useElement } from "./useElement";
import { useState } from "./useState";
import { useEffect } from "./useEffect";

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
