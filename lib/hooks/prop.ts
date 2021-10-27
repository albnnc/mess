import { HookCaller, Initializer } from "../types";
import { element } from "./element";
import { effect } from "./effect";
import { state } from "./state";

export interface PropOptions {
  name: string;
}

export const prop = ($: HookCaller) => {
  return <T>(initializer: Initializer<T>, { name }: PropOptions) => {
    const el = $(element);
    const [value, setValue] = $(state)(initializer);
    $(effect)(() => {
      Object.defineProperty(el, name, {
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
};
