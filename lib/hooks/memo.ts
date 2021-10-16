import { Deps, HookCaller } from "../types";
import { effect } from "./effect";
import { state } from "./state";

export const memo =
  ($: HookCaller) =>
  <T>(fn: () => T, deps: Deps): T => {
    const [value, setValue] = $(state)(fn);
    $(effect)(() => {
      setValue(fn);
    }, deps);
    return value;
  };
