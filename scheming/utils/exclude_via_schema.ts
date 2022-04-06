import { Schema, SchemaMetaData } from "../types/mod.ts";
import { get } from "./get.ts";
import { set } from "./set.ts";

export interface ExcludeViaSchemaOptions {
  readOnly?: boolean;
  writeOnly?: boolean;
  additional?: boolean;
}

// TODO: Handle arrays.
export function excludeViaSchema<T extends Schema>(
  schema: T,
  data: unknown,
  options: ExcludeViaSchemaOptions
) {
  const excluded = {} as Record<string, unknown>;
  const walk = (current: unknown, path: string[]) => {
    if (!isWalkable(current)) {
      throw new Error("Data to split be an object");
    }
    const schemaPathBase = path.reduce(
      (p, v) => [...p, "properties", v],
      [] as string[]
    );
    for (const key in current) {
      const prop = current[key];
      const propSchema = get<unknown>(
        schema,
        [...schemaPathBase, "properties", key],
        undefined
      );
      if (isSchemaLike(propSchema)) {
        if (
          (propSchema.readOnly && options.readOnly) ||
          (propSchema.writeOnly && options.writeOnly)
        ) {
          continue;
        } else if (propSchema.type === "object") {
          walk(prop, [...path, key]);
          continue;
        }
        set(excluded, [...path, key], prop);
        continue;
      }
      if (!options.additional) {
        set(excluded, [...path, key], prop);
      }
    }
  };
  walk(data, []);
  return excluded;
}

function isWalkable(data: unknown): data is Record<PropertyKey, unknown> {
  return Boolean(data && typeof data === "object");
}

function isSchemaLike(
  data: unknown
): data is { type?: string } & Partial<SchemaMetaData> {
  return Boolean(data && typeof data === "object");
}
