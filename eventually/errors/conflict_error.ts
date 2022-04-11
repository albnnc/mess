import { StatusCodeError } from "./status_code_error.ts";

export class ConflictError extends StatusCodeError {
  constructor(message?: string) {
    super("409", message ?? "conflict");
  }
}
