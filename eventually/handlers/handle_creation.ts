import { scheming } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface CreationOptions extends Omit<MutationOptions, "process"> {
  schema: Record<string, unknown>;
}

export async function handleCreation({ schema, ...rest }: CreationOptions) {
  const validate = scheming.createValidator(schema, { mode: "w" });
  await handleMutation({
    process: (data) => {
      validate(data);
      const id = crypto.randomUUID();
      return { id, ...(data as Record<string, unknown>) };
    },
    ...rest,
  });
}
