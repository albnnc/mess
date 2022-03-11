export type SchemaTypeName =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

export type SchemaType =
  | string
  | number
  | boolean
  | SchemaObject
  | SchemaArray
  | null;

export interface SchemaObject {
  [key: string]: SchemaType;
}

export type SchemaArray = SchemaType[];

export type SchemaDefinition = Schema | boolean;

export interface Schema {
  $id?: string;
  $ref?: string;
  $schema?: string;
  $comment?: string;

  type?: SchemaTypeName | SchemaTypeName[];

  format?: string;
  enum?: SchemaType[];
  const?: SchemaType;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  items?: SchemaDefinition | SchemaDefinition[];
  additionalItems?: SchemaDefinition;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: Schema;

  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  properties?: {
    [key: string]: SchemaDefinition;
  };
  patternProperties?: {
    [key: string]: SchemaDefinition;
  };
  additionalProperties?: SchemaDefinition;
  propertyNames?: SchemaDefinition;

  dependencies?: {
    [key: string]: SchemaDefinition | string[];
  };
  if?: SchemaDefinition;
  then?: SchemaDefinition;
  else?: SchemaDefinition;

  allOf?: SchemaDefinition[];
  anyOf?: SchemaDefinition[];
  oneOf?: SchemaDefinition[];
  not?: SchemaDefinition;

  contentMediaType?: string;
  contentEncoding?: string;

  readOnly?: boolean;
  writeOnly?: boolean;
  definitions?: {
    [key: string]: SchemaDefinition;
  };

  default?: SchemaType;
  examples?: SchemaType;

  title?: string;
  description?: string;
  layout?: {
    [key: string]: SchemaType;
  };
}
