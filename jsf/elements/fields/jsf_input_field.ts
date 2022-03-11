import { html, createCustomElement, useProp, useElement } from "../../deps.ts";
import { JsfValueEvent } from "../../events/mod.ts";
import { useDefaults } from "../../hooks/mod.ts";
import { FieldProps, Schema } from "../../types/mod.ts";

export const InputField = createCustomElement<FieldProps>(() => {
  const [schema] = useProp<Schema>("schema", {});
  const [value] = useProp<unknown>("value", undefined);
  const [validity] = useProp<unknown>("validity", undefined);
  useDefaults(schema, value);
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
      <jsf-panic .schema=${schema} .value=${value} .validity=${validity}>
        Invalid schema type
      </jsf-panic>
    `;
  }
  const step =
    schema.type === "integer" &&
    (!schema.multipleOf || schema.multipleOf % 1 !== 0)
      ? 1
      : schema.multipleOf;
  return html`
    <jsf-primitive {...props}>
      <input
        type=${inputType}
        step=${step}
        value=${String(value ?? "")}
        min=${schema.minimum}
        max=${schema.maximum}
        @input=${(ev: InputEvent) => {
          let v: string | number | undefined = (ev.target as HTMLInputElement)
            .value;
          if (v === "") {
            v = undefined;
          } else if (inputType === "number") {
            v = +v;
          }
          element.dispatchEvent(new JsfValueEvent(v));
        }}
      />
    </jsf-primitive>
  `;
});
