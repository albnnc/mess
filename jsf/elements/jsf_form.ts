import {
  toProps,
  useProp,
  useElement,
  useState,
  useMemoFn,
  useEffect,
  collections,
  useEventListener,
  createThemedElement,
  html,
} from "../deps.ts";
import { Schema, Validity } from "../types/mod.ts";
import { getControlElementTag, validateAgainstSchema } from "../utils/mod.ts";
import {
  JsfSubmitEvent,
  JsfValidityEvent,
  JsfValueEvent,
} from "../events/mod.ts";
import { useMergeQueue } from "../_internal/mod.ts";

export const JsfForm = createThemedElement<{
  schema: Schema;
  value?: unknown;
  liveValidated?: unknown;
}>(() => {
  const [schema] = useProp<Schema>("schema", {});
  const [value, setValue] = useProp<unknown>("value", undefined);
  const [liveValidated] = useProp<boolean>("liveValidated", false);
  const element = useElement();
  const [schemaValidity, setSchemaValidity] = useState<Validity>({});
  const [extensionValidity, extendValidity, wait] = useMergeQueue<Validity>({});
  const [validity, setValidity] = useState<Validity>({});
  const validate = useMemoFn(
    (value: unknown) => {
      const schemaValidity = validateAgainstSchema({ schema, value });
      setSchemaValidity(schemaValidity);
    },
    [schema]
  );
  const flushValidity = useMemoFn(() => {
    const flushed = collections.deepMerge(
      schemaValidity as Record<PropertyKey, unknown>,
      extensionValidity as Record<PropertyKey, unknown>
    );
    setValidity(flushed);
    return flushed;
  }, [schemaValidity, extensionValidity]);
  useEffect(() => {
    validate(value);
  }, []);
  useEffect(() => {
    element.dispatchEvent(new JsfValueEvent(value));
  }, [value]);
  useEffect(() => {
    element.dispatchEvent(new JsfValidityEvent(validity));
  }, [validity]);
  useEventListener(
    "jsf-submit-request",
    async (ev: Event) => {
      ev.stopPropagation();
      await wait();
      const validity = flushValidity();
      if (checkValidity(validity)) {
        element.dispatchEvent(new JsfSubmitEvent(value));
      }
    },
    [value, flushValidity]
  );
  const rootFieldProps = { schema, value, validity };
  const rootFieldTag = getControlElementTag(schema);
  return html`
    <${rootFieldTag}
      ...${toProps(rootFieldProps)}
      @jsf-value=${(ev: JsfValueEvent) => {
        setValue(ev.value);
        validate(ev.value);
        if (liveValidated) {
          flushValidity();
        }
      }}
      @jsf-validity=${(ev: JsfValidityEvent) => {
        extendValidity(ev.validity);
      }}
    />
    <slot />
  `;
});

function checkValidity(validity: Validity) {
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
}
