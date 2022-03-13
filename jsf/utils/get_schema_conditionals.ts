import { jsonSchema } from "../deps.ts";
import { Schema } from "../types/mod.ts";

export const getSchemaConditionals = (
  schema: Schema,
  value: unknown
): Schema["properties"] => {
  if (value === undefined) {
    return {};
  }
  return [schema, ...(schema.allOf ?? [])].reduce((prev, curr) => {
    if (typeof curr !== "object" || typeof curr.if !== "object") {
      return prev;
    }
    const validator = new jsonSchema.Validator(curr.if as jsonSchema.Schema);
    const specCompliantValue = JSON.parse(JSON.stringify(value));
    const conditionalSchema = validator.validate(specCompliantValue).valid
      ? curr.then
      : curr.else;
    return conditionalSchema && typeof conditionalSchema === "object"
      ? { ...prev, ...conditionalSchema.properties }
      : prev;
  }, {} as Schema["properties"]);
};
