import { path } from "./deps.ts";

export async function getGlobDir(glob: string): Promise<string> {
  if (
    glob.includes("*") ||
    (await Deno.lstat(glob)
      .then((v) => v.isFile)
      .catch(() => true))
  ) {
    return getGlobDir(path.dirname(glob));
  }
  return glob;
}
