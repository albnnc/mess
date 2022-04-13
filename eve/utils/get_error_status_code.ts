import { scheming } from "../deps.ts";
import { StatusCodeError } from "../errors/mod.ts";

export function getErrorStatusCode<T extends Error>(e: T): string {
  return e instanceof scheming.ValidationError
    ? "400"
    : e instanceof StatusCodeError
    ? e.statusCode
    : "500";
}
