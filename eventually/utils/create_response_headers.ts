import { nats } from "../deps.ts";

export function createResponseHeaders(status: string, description?: string) {
  const headers = nats.headers();
  headers.append("Status", status);
  description && headers.append("description", description);
  return headers;
}
