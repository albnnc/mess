import { mongo, scheming } from "../deps.ts";
import { handleMutating, MutatingOptions } from "./handle_mutating.ts";

export interface CreatingOptions<T extends scheming.Schema>
  extends Omit<MutatingOptions, "mutation" | "pioneer" | "process"> {
  db: mongo.Database;
  schema: T;
  process?: (id: string, data: scheming.FromSchema<T>) => void | Promise<void>;
}

export async function handleCreating<T extends scheming.Schema>({
  db,
  schema,
  process,
  entity,
  ...rest
}: CreatingOptions<T>) {
  const collection = db.collection(entity);
  await handleMutating({
    entity,
    mutation: "CREATE",
    pioneer: true,
    process: async (id, data) => {
      scheming.validateViaSchema(schema, data, { mode: "w" });
      await process?.(id, data);
      const identified = { id, ...data };
      await collection.insertOne({ ...identified });
      return identified;
    },
    ...rest,
  });
}
