import { Initializer } from "../types";
import { getInitialValue } from "./getInitialValue";

export const ensureKey = <T>(
  target: Record<keyof any, any>,
  key: keyof any,
  initializer: Initializer<T>
): T => {
  if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = getInitialValue(initializer);
  }
  return target[key];
};
