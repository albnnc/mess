import { Initializer } from "../types.ts";
import { getInitialValue } from "./getInitialValue.ts";

export const ensureKey = <T>(
  target: Record<string | number | symbol, unknown>,
  key: string | number | symbol,
  initializer: Initializer<T>
): T => {
  if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = getInitialValue(initializer);
  }
  return target[key] as T;
};
