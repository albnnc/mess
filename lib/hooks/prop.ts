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
      console.log("[prop] effect, set", name, "to", value);
      Object.defineProperty(el, name, {
        configurable: true,
        enumerable: true,
        get() {
          // console.log("[prop] get", name, "=", value);
          return value;
        },
        set(v: T) {
          console.log("[prop] set", name, "to", v);
          setValue(() => v);
        },
      });
      // console.log("[prop] effect, got", name, "=", el[name]);
    }, [value, setValue]);
    return [value, setValue] as const;
  };
};
