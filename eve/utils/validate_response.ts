import { nats } from "../deps.ts";
import { StatusCodeError } from "../errors/mod.ts";

export function validateResponse(msg: nats.Msg) {
  const statusCode = msg.headers?.get("Status-Code");
  const description = msg.headers?.get("Description");
  if (statusCode && !statusCode.startsWith("2")) {
    throw new StatusCodeError(statusCode, description);
  }
}
