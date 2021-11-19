import { crypto } from "./deps.ts";

export async function hashString(data: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-384",
    new TextEncoder().encode(data)
  );
  return new Uint8Array(bytes)
    .reduce((p, v) => p + v.toString(16).padStart(2, "0"), "")
    .slice(-8);
}
