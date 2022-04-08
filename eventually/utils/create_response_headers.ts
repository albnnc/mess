import { nats } from "../deps.ts";

export function createResponseHeaders(status: string, description?: string) {
  const headers = nats.headers();
  headers.append("Status-Code", status);
  if (description) {
    headers.append("Description", description);
  }
  return headers;
}
