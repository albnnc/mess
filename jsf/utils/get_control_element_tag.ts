import { Schema } from "../types/mod.ts";

export function getControlElementTag(schema: Schema) {
  if (typeof schema.type !== "string") {
    return uknownElementName;
  }
  return (
    {
      string: inputElementName,
      number: inputElementName,
      integer: inputElementName,
      object: objectElementName,
    }[schema.type as string] ?? uknownElementName
  );
}

const inputElementName = "jsf-input-field";
const objectElementName = "jsf-object-field";
const uknownElementName = "jsf-unknown-field";
