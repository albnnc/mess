import { esbuild } from "./deps.ts";

export function createPlugin(): esbuild.Plugin {
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
