import { microdiff } from "../deps.ts";
import { get } from "./get.ts";
import { set } from "./set.ts";

export function createPatch(
  before: Record<string, unknown>,
  after: Record<string, unknown>
) {
  const patch: Record<string, unknown> = {};
  const diff = microdiff(before, after);
  for (const v of diff) {
    const numericIndex = v.path.findIndex((v) => typeof v === "number");
    if (numericIndex >= 0) {
      const nonNumericPath = v.path.slice(0, numericIndex);
      set(patch, nonNumericPath, get(after, nonNumericPath));
    } else if (v.type === "CREATE" || v.type === "CHANGE") {
      set(patch, v.path, v.value);
    } else if (v.type === "REMOVE") {
      set(patch, v.path, null);
    }
  }
  return patch;
}
