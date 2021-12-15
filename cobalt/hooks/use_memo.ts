import { Deps } from "../types.ts";
import { compareDeps } from "../utils/mod.ts";
import { useState } from "./use_state.ts";

export const useMemo = <T>(fn: () => T, deps: Deps): T => {
  const [data] = useState({ value: fn(), deps });
  return compareDeps(deps, data.deps) ? data.value : (data.value = fn());
};
