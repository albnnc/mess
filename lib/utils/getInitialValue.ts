import { Initializer } from "../types";

export const getInitialValue = <T extends unknown>(
  initializer: Initializer<T>
) => {
  return initializer instanceof Function ? initializer() : initializer;
};
