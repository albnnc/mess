import { Schema } from "../types/mod.ts";

export function getControlElementName(schema: Schema) {
  if (typeof schema.type !== "string") {
    return uknownElementName;
  }
  return (
    {
      string: inputElementName,
      number: inputElementName,
      integer: inputElementName,
    }[schema.type as string] ?? uknownElementName
  );
}

const inputElementName = "jsf-input-field";
const uknownElementName = "jsf-unknown-field";
