import { nats } from "../deps.ts";

export function validateResponse(msg: nats.Msg) {
  const statusCode = msg.headers?.get("Status-Code");
  const description = msg.headers?.get("Description");
  if (statusCode && !statusCode.startsWith("2")) {
    throw new Error(description);
  }
}