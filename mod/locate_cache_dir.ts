let cacheDir: string | undefined;

export async function locateCacheDir(): Promise<string> {
  if (cacheDir) {
    return cacheDir;
  }
  const process = await Deno.run({
    cmd: ["deno", "info", "--json"],
    stdout: "piped",
  });
  const [raw] = await Promise.all([process.output(), process.status()]);
  const { modulesCache } = JSON.parse(new TextDecoder().decode(raw));
  return (cacheDir = modulesCache);
}
