import { Schema } from "../types/mod.ts";

export function adaptSchema(schema: Schema, mode: "r" | "w") {
  const adapted: Record<string, unknown> = JSON.parse(JSON.stringify(schema));
  if (!isPickable(adapted.properties)) {
    return adapted;
  }
  for (const key in adapted.properties) {
    const prop = adapted.properties[key];
    if (!isPickable(prop)) {
      continue;
    }
    if (prop[mode === "r" ? "writeOnly" : "readOnly"]) {
      delete adapted.properties[key];
      if (Array.isArray(adapted.required)) {
        adapted.required = adapted.required.filter((v) => v !== key);
      }
      continue;
    }
    if (prop.type === "object") {
      adapted.properties[key] = adaptSchema(prop, mode);
    }
  }
  return adapted as Schema;
}

function isPickable(v: unknown): v is Record<PropertyKey, unknown> {
  return !!v && typeof v === "object";
}
