export async function flatPromise(maybePromise: unknown) {
  const value = await maybePromise;
  if (value && typeof value === "object") {
    const objectified = value as Record<string | number | symbol, unknown>;
    for (const k of Object.keys(value)) {
      objectified[k] = await flatPromise(objectified[k]);
    }
  }
  return value;
}
