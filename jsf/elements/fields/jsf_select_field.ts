import {
  html,
  createCustomElement,
  toProps,
  useElement,
  CustomElement,
} from "../../deps.ts";
import { JsfValueEvent } from "../../events/mod.ts";
import { useDefaults, useFieldProps } from "../../hooks/mod.ts";
import { FieldProps, Schema, SchemaType } from "../../types/mod.ts";

export const JsfSelectField = createCustomElement<FieldProps>(() => {
  const element = useElement();
  const props = useFieldProps();
  useDefaults(props);
  const { schema, value, setValue } = props;
  if (!isValidSchema(schema)) {
    return html`
      <jsf-panic-layout ...${toProps(props)}>
        Wrong jsf-select-field schema
      </jsf-panic-layout>
    `;
  }
  return html`
    <jsf-primitive-layout ...${toProps(props)}>
      <tn-select
        .value=${value}
        .options=${schema.oneOf.map((v) => ({
          value: v.const,
          title: v.title ?? v.const,
        }))}
        @input=${(ev: InputEvent) => {
          const { value } = ev.target as CustomElement<Record<string, unknown>>;
          setValue(value);
          element.dispatchEvent(new JsfValueEvent(value));
        }}
      />
    </jsf-primitive-layout>
  `;
});

function isValidSchema(schema: Schema): schema is {
  oneOf: {
    const: SchemaType;
    title?: string;
  }[];
} {
  return (
    schema &&
    Array.isArray(schema.oneOf) &&
    schema.oneOf.every((v) => v && typeof v === "object" && "const" in v)
  );
}
