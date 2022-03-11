import { Schema } from "./schema.ts";
import { Validity } from "./validity.ts";

export interface ValidateAgainstSchemaOptions {
  schema: Schema;
  value: unknown;
}

export interface ValidateAgainstSchemaFn {
  (options: ValidateAgainstSchemaOptions): Validity;
}
