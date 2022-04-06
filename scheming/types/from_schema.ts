// Adapted from https://github.com/andnp/type-level-schema
//
// TODO: Switch to `unknown` and `never` usage instead of `any`.
//
// deno-lint-ignore-file ban-types no-explicit-any
import {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  NullSchema,
  ArraySchema,
  TupleSchema,
  ObjectSchema,
  AllOf,
} from "./defs/mod.ts";
import { simplytyped } from "../deps.ts";
import { SchemaDefinition } from "./schema.ts ";

type FromSchemaProperties<S extends ObjectSchema> =
  S["properties"] extends Record<string, SchemaDefinition>
    ? {
        -readonly [K in keyof S["properties"]]?: FromSchema<S["properties"][K]>;
      }
    : object;

type FromSchemaRequired<
  S extends ObjectSchema,
  P extends object
> = simplytyped.If<
  simplytyped.HasKey<S, "required">,
  S["required"] extends any[] | readonly any[]
    ? simplytyped.Required<P, simplytyped.UnionizeTuple<S["required"]>>
    : P,
  P
>;

type FromSchemaObject<S extends ObjectSchema> = FromSchemaRequired<
  S,
  FromSchemaProperties<S>
>;

type FromSchemaItems<S extends TupleSchema | ArraySchema> = {
  [K: number]: simplytyped.If<
    simplytyped.HasKey<S, "items">,
    S["items"] extends SchemaDefinition ? FromSchema<S["items"]> : any,
    any
  >;
};

type FromSchemaString<S extends StringSchema> = simplytyped.If<
  simplytyped.HasKey<S, "enum">,
  S["enum"] extends string[] ? simplytyped.UnionizeTuple<S["enum"]> : string,
  string
>;

type FromSchemaIntersection<I> = I extends SchemaDefinition
  ? FromSchema1<I>
  : any;

type FromSchemaAllOf<S extends AllOf> = simplytyped.If<
  simplytyped.HasKey<S, "allOf">,
  S["allOf"] extends simplytyped.Vector<SchemaDefinition>
    ? FromSchemaIntersection<simplytyped.IntersectTuple<S["allOf"]>>
    : any,
  any
>;

// This allows depth-1 recursion for anything that causes
// circular reference issues for instance `allOf`.
type FromSchema1<S extends SchemaDefinition> = S extends StringSchema
  ? FromSchemaString<S>
  : S extends NumberSchema
  ? number
  : S extends BooleanSchema
  ? boolean
  : S extends NullSchema
  ? null | undefined
  : S extends ArraySchema | TupleSchema
  ? FromSchemaItems<S>
  : S extends ObjectSchema
  ? FromSchemaObject<S>
  : any;

export type FromSchema<S extends SchemaDefinition> = S extends AllOf
  ? FromSchemaAllOf<S>
  : FromSchema1<S>;
