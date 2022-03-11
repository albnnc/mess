import { Schema } from "./schema.ts";

export interface FormManagerOptions<T = unknown> {
  initialValue?: T;
  schema: Schema;
  dereference?: (schema: Schema) => Promise<Schema>;
}
