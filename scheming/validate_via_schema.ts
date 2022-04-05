import { Ajv } from "./deps.ts";
import { adaptSchema } from "./adapt_schema.ts";
import { FromSchema, Schema } from "./types/mod.ts";

const ajv = new Ajv({ allErrors: true });

export interface ValidateViaSchemaOptions {
  mode?: "r" | "w";
}

// TODO: Respect validation mode while asserting.
export function validateViaSchema<T extends Schema>(
  schema: T,
  data: unknown,
  { mode }: ValidateViaSchemaOptions = {}
): asserts data is FromSchema<T> {
  const adaptedSchema = mode
    ? adaptSchema(schema as Record<string, unknown>, mode)
    : schema;
  if (!ajv.validate(adaptedSchema, data)) {
    throw new Error(ajv.errorsText(ajv.errors));
  }
}
