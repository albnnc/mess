import {
  html,
  createCustomElement,
  toProps,
  useProp,
  useElement,
  useState,
  useMemo,
  useMemoFn,
  useEffect,
} from "../deps.ts";
import { Schema, Validity } from "../types/mod.ts";
import { getControlElementTag, validateAgainstSchema } from "../utils/mod.ts";
import {
  JsfSubmitEvent,
  JsfValidityEvent,
  JsfValueEvent,
} from "../events/mod.ts";
import { useMergeQueue } from "../_internal/mod.ts";

export const JsfForm = createCustomElement<{
  schema: Schema;
  value?: unknown;
}>(() => {
  const [schema] = useProp<Schema>("schema", {});
  const [value, setValue] = useProp<unknown>("value", undefined);
  const element = useElement();
  const [schemaValidity, setSchemaValidity] = useState<Validity>({});
  const [extensionValidity, extendValidity, wait] = useMergeQueue<Validity>({});
  const validity = useMemo(
    // () => merge(clone(schemaValidity), clone(extensionValidity)),
    () => ({ ...schemaValidity, ...extensionValidity }),
    [schemaValidity, extensionValidity]
  );
  const [_submitted, setSubmitted] = useState(false);
  const valid = useMemo(() => {
    const check = (value: unknown): boolean => {
      if (!value || typeof value !== "object") {
        return true;
      }
      const toBeChecked = value as Record<string | number | symbol, unknown>;
      return Object.keys(toBeChecked).reduce(
        (prev, curr) => prev && check(toBeChecked[curr]),
        !Array.isArray(toBeChecked.errors) || toBeChecked.errors.length < 1
      );
    };
    return check(validity);
  }, [validity]);
  const submit = useMemoFn(async () => {
    await wait();
    element.dispatchEvent(new JsfSubmitEvent(value));
    setSubmitted(true);
    return value;
  }, [value]);
  const validate = useMemoFn(
    (value: unknown) => {
      const validity = validateAgainstSchema({ schema, value });
      setSchemaValidity(validity);
    },
    [schema]
  );
  useEffect(() => {
    element.dispatchEvent(new JsfSubmitEvent(value));
  }, [value]);
  useEffect(() => {
    element.dispatchEvent(new JsfValidityEvent(validity));
  }, [validity]);
  const rootFieldProps = { schema, value, validity };
  const rootFieldTag = getControlElementTag(schema);
  return html`
    <form
      novalidate
      @submit=${async (ev: SubmitEvent) => {
        ev.preventDefault();
        await wait();
        if (!valid) {
          return;
        }
        submit();
      }}
    >
      <${rootFieldTag}
        ...${toProps(rootFieldProps)}
        @jsf-value=${(ev: JsfValueEvent) => {
          setValue(ev.value);
          validate(ev.value);
        }}
        @jsf-validity=${(ev: JsfValidityEvent) => {
          extendValidity(ev.validity);
        }}
      />
      <slot />
    </form>
  `;
});
