import { Schema } from "../types/mod.ts";

export function getSchemaProperties(schema: Schema) {
  return [schema, ...(schema.allOf ?? [])].reduce(
    (prev, curr) =>
      curr &&
      typeof curr === "object" &&
      curr.properties &&
      typeof curr.properties === "object"
        ? // Is `deepMerge` needed here?
          { ...prev, ...curr.properties }
        : prev,
    {} as Record<string, unknown>
  ) as Schema["properties"];
}
