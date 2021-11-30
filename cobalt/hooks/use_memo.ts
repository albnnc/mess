import { Deps } from "../types.ts";
import { useEffect } from "./use_effect.ts";
import { useState } from "./use_state.ts";

export const useMemo = <T>(fn: () => T, deps: Deps): T => {
  const [value, setValue] = useState(fn);
  useEffect(() => {
    setValue(fn);
  }, deps);
  return value;
};
