import {
  createCustomElement,
  html,
  toProps,
  useEffect,
  useElement,
} from "../../deps.ts";
import { JsfValueEvent } from "../../events/mod.ts";
import { useDefaults, useFieldProps } from "../../hooks/mod.ts";
import { FieldProps, Schema } from "../../types/mod.ts";
import { getControlElementName, getSchemaProperties } from "../../utils/mod.ts";

export const JsfObjectField = createCustomElement<FieldProps>(() => {
  const element = useElement();
  const props = useFieldProps();
  useDefaults(props);
  const {
    schema,
    schema: { layout: { order } = {} },
    value,
    setValue,
    validity = {},
  } = props;
  const objectifiedValue = (
    value && typeof value === "object" ? value : {}
  ) as Record<string, unknown>;
  const properties = getSchemaProperties(schema) ?? {};
  const availables = { ...properties };
  // const conditionals = getConditionals(schema, value) ?? {};
  // const availables = { ...properties, ...conditionals };

  const availableKeys = new Set(Object.keys(availables));
  const keys = (Array.isArray(order) ? order : [])
    .map((v) => v?.toString() ?? "")
    .reduce((prev, curr) => {
      if (availableKeys.has(curr)) {
        prev.push(curr);
        availableKeys.delete(curr);
        return prev;
      }
      return prev;
    }, [] as string[])
    .concat(Array.from(availableKeys));

  useEffect(() => {
    // An object without values from removed fields.
    const filtered = { ...objectifiedValue };
    const availableKeys = new Set(Object.keys(availables));
    let hasToUpdate = false;
    Object.keys(objectifiedValue ?? {}).forEach((k) => {
      if (!availableKeys.has(k)) {
        filtered[k] = undefined;
        hasToUpdate = true;
      }
    });
    if (hasToUpdate) {
      setValue(filtered);
      element.dispatchEvent(new JsfValueEvent(filtered));
    }
  }, [keys.join()]);

  console.log("keys", keys);

  return html`
    <jsf-object-template ...${toProps(props)}>
      ${keys.map((key) => {
        const controlProps = {
          key,
          ...props,
          schema: availables[key] as Schema,
          value: objectifiedValue[key],
          validity: validity.properties?.[key],
          // onValue: (v) => {
          //   onValue?.(
          //     merge(clone(value), { [key]: v }, (a, b) =>
          //       Array.isArray(a) ? b : undefined
          //     )
          //   );
          // },
          // onValidity: e =>
          //   onValidity?.(
          //     merge(clone(validity), { properties: { [key]: e } }, (a, b, k) =>
          //       k === 'errors' ? b : undefined
          //     )
          //   )
        };
        if (typeof controlProps.schema !== "object") {
          return html`
            <jsf-panic-layout ...${toProps(controlProps)}>
              Object properties must be a valid JSONSchema
            </jsf-panic-layout>
          `;
        }
        const tag = getControlElementName(controlProps.schema);
        return html`
          <${tag}
            ...${toProps(controlProps)}
            @jsf-value=${(ev: JsfValueEvent) => {
              ev.stopPropagation();
              const nextValue = {
                ...objectifiedValue,
                [key]: ev.value,
              };
              setValue(nextValue);
              element.dispatchEvent(new JsfValueEvent(nextValue));
            }}
          />
        `;
      })}
    </jsf-object-template>
  `;
});
