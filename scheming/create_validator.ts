import { Ajv } from "./deps.ts";
import { adaptSchema } from "./adapt_schema.ts";

const ajv = new Ajv({ allErrors: true });

export interface ValidatorOptions {
  mode?: "r" | "w";
}

export function createValidator(
  schema: Record<string, unknown>,
  { mode }: ValidatorOptions = {}
) {
  const adaptedSchema = mode ? adaptSchema(schema, mode) : schema;
  const validateViaAjv =
    ajv.compile<Record<PropertyKey, unknown>>(adaptedSchema);
  return (data: unknown) => {
    const valid = validateViaAjv(data);
    if (!valid) {
      throw new Error(ajv.errorsText(validateViaAjv.errors));
    }
  };
}
