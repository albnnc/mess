type Accesible = Record<string | number | symbol, unknown>;

export const get = <T extends unknown>(
  data: unknown,
  path: string | string[],
  defaultValue?: T
) => {
  const pathArray = Array.isArray(path) ? path : path.split(".");
  return pathArray.reduce((acc, v) => {
    try {
      acc =
        (acc as Accesible)[v] === undefined
          ? defaultValue
          : (acc as Accesible)[v];
    } catch {
      return defaultValue;
    }
    return acc;
  }, data) as T;
};
