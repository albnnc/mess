import { html, createCustomElement, useElement, toProps } from "../../deps.ts";
import { JsfValueEvent } from "../../events/mod.ts";
import { useDefaults, useFieldProps } from "../../hooks/mod.ts";
import { FieldProps } from "../../types/mod.ts";

export const JsfInputField = createCustomElement<FieldProps>(() => {
  const props = useFieldProps();
  useDefaults(props);
  const { schema, value, setValue } = props;
  const element = useElement();
  const inputType =
    typeof schema.type === "string" &&
    {
      string: "text",
      number: "number",
      integer: "number",
    }[schema.type as string];
  if (!inputType) {
    return html`
      <jsf-panic ...${toProps(props)}>Invalid schema type</jsf-panic>
    `;
  }
  const step =
    schema.type === "integer" &&
    (!schema.multipleOf || schema.multipleOf % 1 !== 0)
      ? 1
      : schema.multipleOf;
  return html`
    <jsf-primitive-layout ...${toProps(props)}>
      <tn-input
        type=${inputType}
        min=${schema.minimum}
        max=${schema.maximum}
        step=${step}
        .value=${String(value ?? "")}
        @input=${(ev: InputEvent) => {
          const input = ev.target as HTMLInputElement;
          let v: string | number | undefined = input.value;
          if (v === "") {
            v = undefined;
          } else if (input.type === "number") {
            v = +v;
          }
          setValue(v);
          element.dispatchEvent(new JsfValueEvent(v));
        }}
      />
    </jsf-primitive-layout>
  `;
});
