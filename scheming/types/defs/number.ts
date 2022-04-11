import { simplytyped } from "../../deps.ts";
import { TypeDef } from "../mod.ts";

export type NumberSchema = Partial<{
  multipleOf: number;
  minimum: number;
  maximum: number;
  exclusiveMinimum: boolean;
  exclusiveMaximum: boolean;
  enum: simplytyped.Vector<number>;
}> &
  TypeDef<"number">;
