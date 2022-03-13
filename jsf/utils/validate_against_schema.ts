import { Validity } from "../types/mod.ts";
import { ValidateAgainstSchemaOptions } from "../types/validate_against_schema_fn.ts";

// export interface ValidateAgainstSchemaOptions
//   extends ValidateAgainstSchemaOptions {
//   transformErrors?: (errors: unknown[]) => unknown[];
// }

export function validateAgainstSchema({
  schema,
  value,
}: ValidateAgainstSchemaOptions): Validity {
  // try {
  //   const validateViaAjv = ajv.compile(schema);
  //   validateViaAjv(value);
  //   const ajvErrors =
  //     transformAjvErrors?.(validateViaAjv.errors ?? []) ??
  //     validateViaAjv.errors ??
  //     [];
  //   const validity =
  //     ajvErrors.reduce((prev, curr) => {
  //       const path = curr.instancePath
  //         .replace(/\/(\D)/g, '/properties/$1')
  //         .replace(/\/(\d)/g, '/items/$1')
  //         .split('/')
  //         .map(v => v.replace(/~0/g, '~').replace(/~1/g, '/'))
  //         .slice(1);
  //       path.push('errors');
  //       const existingValue = get(prev, path) ?? [];
  //       set(prev, path, [...existingValue, curr.message]);
  //       return prev;
  //     }, {}) ?? {};
  //   return validity;
  // } catch (e) {
  //   console.warn(e);
  //   return {};
  // }
  return {};
}
