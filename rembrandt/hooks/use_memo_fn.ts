import { Deps } from "../types.ts";
import { useMemo } from "./use_memo.ts";

// deno-lint-ignore no-explicit-any
export const useMemoFn = <T extends (...args: any) => any>(
  fn: T,
  deps: Deps
): T => {
  return useMemo(() => fn, deps);
};
