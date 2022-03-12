import { useProp } from "../deps.ts";
import { Schema, Validity } from "../types/mod.ts";

export function useFieldProps() {
  const [schema, setSchema] = useProp<Schema>("schema", {});
  const [value, setValue] = useProp<unknown>("value", undefined);
  const [validity, setValidity] = useProp<Validity | undefined>(
    "validity",
    undefined
  );
  return { schema, setSchema, value, setValue, validity, setValidity };
}
