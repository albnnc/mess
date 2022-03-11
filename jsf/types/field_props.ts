import { Schema } from "./schema.ts";
import { Validity } from "./validity.ts";

export interface FieldProps<T = unknown> {
  schema: Schema;
  value?: T;
  validity?: Validity;
}
