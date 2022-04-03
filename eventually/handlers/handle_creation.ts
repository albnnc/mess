import { Ajv } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface CreationOptions extends Omit<MutationOptions, "process"> {
  schema: Record<string, unknown>;
}

export async function handleCreation({ schema, ...rest }: CreationOptions) {
  // TODO: Add additional validations to handle things like ids.
  if (schema.type !== "object") {
    throw new Error("Only object schemas supported");
  }
  const ajv = new Ajv({ allErrors: true });
  const validateViaAjv = ajv.compile<Record<PropertyKey, unknown>>(schema);
  await handleMutation({
    process: (data) => {
      const valid = validateViaAjv(data);
      if (!valid) {
        throw new Error(ajv.errorsText(validateViaAjv.errors));
      }
      const id = crypto.randomUUID();
      return { id, ...data };
    },
    ...rest,
  });
}
