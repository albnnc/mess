import { mongo, scheming } from "../deps.ts";
import { handleMutation, MutationOptions } from "./handle_mutation.ts";

export interface CreationOptions<T extends scheming.Schema>
  extends Omit<MutationOptions, "process"> {
  db: mongo.Database;
  schema: T;
  validate?: (data: scheming.FromSchema<T>) => void;
}

export async function handleCreation<T extends scheming.Schema>({
  db: _,
  schema,
  validate,
  ...rest
}: CreationOptions<T>) {
  await handleMutation({
    process: (data) => {
      scheming.validateViaSchema(schema, data, { mode: "w" });
      validate?.(data);
      const id = crypto.randomUUID();
      return { id, ...data };
    },
    ...rest,
  });
}
