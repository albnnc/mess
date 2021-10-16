import { Initializer } from "..";

export const ensureKey = <T>(
  target: Record<keyof any, any>,
  key: keyof any,
  initializer: Initializer<T>
): T => {
  if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = initializer instanceof Function ? initializer() : initializer;
  }
  return target[key];
};
