import { toKebabCase } from "./to_kebab_case.ts";
import { cyrb53 } from "./cyrb_53.ts";

export function sxToStyle(sx: unknown) {
  if (!sx || typeof sx !== "object") {
    throw new Error("sx prop must be an object");
  }
  const getRaw = (sx: Record<string, unknown>): string => {
    return Object.entries(sx).reduce(
      (p, [k, v]) =>
        v && typeof v === "object"
          ? p + " " + k + " {" + getRaw(v as Record<string, unknown>) + "}"
          : p + toKebabCase(k) + ":" + v + ";",
      ""
    );
  };
  const raw = getRaw(sx as Record<string, unknown>);
  const hash = cyrb53(raw).toString();
  const name = `sx-${hash}`;
  const style = `.${name}{${raw}}`;
  return { hash, name, style };
}
