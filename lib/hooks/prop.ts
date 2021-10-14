import { HookCaller } from "../types";
import { element } from "./element";
import { state } from "./state";

export interface PropOptions {
  name: string;
}

export const prop = ($: HookCaller) => {
  return <T>(initializer: T | (() => T), { name }: PropOptions) => {
    const e = $(element);
    const [value, setValue] = $(state)(initializer);
    // $(effect)(() => {
    //   Object.defineProperty(e, name, {
    //     // ...
    //   });
    // }, []);
  };
};
