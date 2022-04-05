import {
  AllOf,
  AnyOf,
  ArraySchema,
  BooleanSchema,
  EnumSchema,
  Not,
  NullSchema,
  NumberSchema,
  ObjectSchema,
  OneOf,
  Ref,
  StringSchema,
  TupleSchema,
} from "./defs/mod.ts";

export type Type =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "null";

export interface TypeDef<T extends Type> {
  type: T;
}

export type SchemaDefinition =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | NullSchema
  | ArraySchema
  | TupleSchema
  | ObjectSchema
  | EnumSchema
  | AllOf
  | AnyOf
  | OneOf
  | Not
  | Ref;

export interface SchemaMetaData {
  $schema: string;
  id: string;
  title: string;
  description: string;
  default: string;
  definitions: Record<string, SchemaDefinition>;
}

export type Schema = SchemaDefinition & Partial<SchemaMetaData>;
