import { Ajv, mongo } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface CreationOptions extends Omit<MutationOptions, "validate"> {
  schema: Record<string, unknown>;
  // collection: mongo.Collection<unknown>;
}

export async function handleCreation({
  schema,
  // collection,
  ...rest
}: CreationOptions) {
  const ajv = new Ajv();
  const validateViaAjv = ajv.compile(schema);
  await handleMutation({
    validate: (data) => {
      validateViaAjv(data);
      if (ajv.errors) {
        throw new Error(ajv.errorsText());
      }
    },
    ...rest,
  });
}
