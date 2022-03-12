export function toProps<T extends Record<string, unknown>>(data: T) {
  return Object.keys(data).reduce(
    (p, k) => ({ ...p, [`.${k}`]: data[k] }),
    {} as {
      [K in keyof T as K extends string ? `.${K}` : never]: T[K];
    }
  );
}
