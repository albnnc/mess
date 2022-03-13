import {
  useEffect,
  useElement,
  useMemo,
  useMemoFn,
  useState,
} from "../deps.ts";
import { JsfSubmitEvent, JsfValidityEvent } from "../events/mod.ts";
import { FormManager, FormManagerOptions, Validity } from "../types/mod.ts";
import { validateAgainstSchema } from "../utils/mod.ts";
import { useMergeQueue } from "../_internal/mod.ts";

export function useFormManager<
  T extends unknown,
  Options extends FormManagerOptions<T> = FormManagerOptions<T>
>(
  options: Options
): Options extends { initialValue: T }
  ? FormManager<T>
  : FormManager<T | undefined> {
  const element = useElement();
  const { schema, initialValue } = options;
  const [value, setValue] = useState(initialValue);
  const [schemaValidity, setSchemaValidity] = useState<Validity>({});
  const [extensionValidity, extendValidity, wait] = useMergeQueue<Validity>({});

  const validity = useMemo(
    // () => merge(clone(schemaValidity), clone(extensionValidity)),
    () => ({ ...schemaValidity, ...extensionValidity }),
    [schemaValidity, extensionValidity]
  );

  const [submitted, setSubmitted] = useState(false);
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

  // TODO:
  // Add ability to defer validation to different events,
  // so the `validate` function splits into `validateAgainstSchema`
  // (already in registry) for usage inside `onValue` and `flushValidity`
  // to be used either in `onValue` or in `onSubmit`.
  const validate = useMemoFn(
    (value: T) => {
      // TODO: Use one from context.
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

  return {
    options,
    value,
    setValue,
    validity,
    extendValidity,
    valid,
    submitted,
    wait,
    submit,
    validate,
  } as any;
}
