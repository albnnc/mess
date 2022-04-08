import { simplytyped } from "../../deps.ts";
import { SchemaDefinition, TypeDef } from "../mod.ts";

type ArrayOptions = Partial<{
  minItems: number;
  maxItems: number;
  uniqueItems: boolean;
}>;

export type ArraySchema = Partial<{
  items: SchemaDefinition;
}> &
  ArrayOptions &
  TypeDef<"array">;

export type TupleSchema = Partial<{
  items: simplytyped.Vector<SchemaDefinition>;
  additionalItems: boolean;
}> &
  ArrayOptions &
  TypeDef<"array">;
