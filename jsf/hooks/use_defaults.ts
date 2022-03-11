import { useEffect, useElement } from "../deps.ts";
import { JsfValueEvent } from "../events/mod.ts";
import { Schema } from "../types/mod.ts";

export function useDefaults(schema: Schema, value: unknown) {
  const element = useElement();
  useEffect(() => {
    if (value === undefined && schema.default) {
      element.dispatchEvent(new JsfValueEvent(schema.default));
    }
  }, [value]);
}
