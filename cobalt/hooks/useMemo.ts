import { Deps } from "../types.ts";
import { useEffect } from "./useEffect.ts";
import { useState } from "./useState.ts";

export const useMemo = <T>(fn: () => T, deps: Deps): T => {
  const [value, setValue] = useState(fn);
  useEffect(() => {
    setValue(fn);
  }, deps);
  return value;
};
