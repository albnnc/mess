import { path } from "./deps.ts";

export async function locateCacheFile(
  cacheDir: string,
  url: string
): Promise<string | undefined> {
  const [_, protocol, host, pathname] =
    url.match(/(https)?:\/\/([^\/]+)(.+)/) ?? [];
  if (!protocol || !host || !pathname) {
    return undefined;
  }
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(pathname)
  );
  const pathnameHash = new Uint8Array(bytes).reduce(
    (p, v) => p + v.toString(16).padStart(2, "0"),
    ""
  );
  const filePath = path.join(cacheDir, protocol, host, pathnameHash);
  if (
    await Deno.lstat(filePath)
      .then(() => false)
      .catch(() => true)
  ) {
    return undefined;
  }
  return filePath;
}
