import { Initializer } from "../types.ts";

export const getInitialValue = <T extends unknown>(
  initializer: Initializer<T>
) => {
  return initializer instanceof Function ? initializer() : initializer;
};
