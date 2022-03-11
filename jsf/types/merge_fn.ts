export type MergeFn = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  key?: string
) => Record<string, unknown>;
