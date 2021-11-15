import { Deps } from "../types";
import { useEffect } from "./useEffect";
import { useState } from "./useState";

export const useMemo = <T>(fn: () => T, deps: Deps): T => {
  const [value, setValue] = useState(fn);
  useEffect(() => {
    setValue(fn);
  }, deps);
  return value;
};
