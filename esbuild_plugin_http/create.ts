import { esbuild } from "./deps.ts";
import { locateCacheDir } from "./locate_cache_dir.ts";
import { locateCacheFile } from "./locate_cache_file.ts";

export interface EsbuildPluginHttpOptions {
  cacheDir?: string;
}

export async function create({
  cacheDir: passedCacheDir,
}: EsbuildPluginHttpOptions = {}): Promise<esbuild.Plugin> {
  const cacheDir = passedCacheDir ?? (await locateCacheDir());
  return {
    name: "http",
    setup(build) {
      build.onResolve({ filter: /^https?:\/\// }, (args) => ({
        path: args.path,
        namespace: "http-url",
      }));
      build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => ({
        path: new URL(args.path, args.importer).toString(),
        namespace: "http-url",
      }));
      build.onLoad({ filter: /.*/, namespace: "http-url" }, async (args) => {
        const cacheFile = await locateCacheFile(cacheDir, args.path);
        if (cacheFile) {
          return { contents: await Deno.readTextFile(cacheFile) };
        }
        const getContents = async (url: string): Promise<string> => {
          const response = await fetch(url);
          const location = response.headers.get("location");
          if ([301, 302, 307].includes(response.status) && location) {
            return getContents(location);
          }
          return await response.text();
        };
        return { contents: await getContents(args.path) };
      });
    },
  };
}
