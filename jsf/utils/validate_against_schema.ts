import { algo, jsonSchema } from "../deps.ts";
import { Validity } from "../types/mod.ts";
import { ValidateAgainstSchemaOptions } from "../types/validate_against_schema_fn.ts";

export function validateAgainstSchema({
  schema,
  value,
}: ValidateAgainstSchemaOptions): Validity {
  try {
    const validator = new jsonSchema.Validator(schema as jsonSchema.Schema);
    const specCompliantValue = JSON.parse(JSON.stringify(value ?? {}));
    const { valid, errors } = validator.validate(specCompliantValue);
    if (valid) {
      return {};
    }
    return errors
      .filter((v) => v.keyword !== "properties")
      .reduce((p, v) => {
        const path = v.keywordLocation
          .split("/")
          .slice(1, -1)
          .concat(["errors"]);
        if (v.keyword === "required") {
          const [_, propertyName] = v.error.match(/property \"(.+)\"/) ?? [];
          if (propertyName) {
            path.splice(-1, 0, "properties", propertyName);
            v.error = "Required field.";
          }
        }
        const existing = algo.get(p, path, [] as string[]);
        algo.set(
          p as Record<string, unknown>,
          path,
          existing.concat([v.error])
        );
        return p;
      }, {} as Validity);
  } catch (e) {
    console.warn(e);
    return {};
  }
}
