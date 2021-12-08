import { BuildOptions } from "./build.ts";
import { oak } from "./deps.ts";

export type ServeOptions = Pick<BuildOptions, "outputDir">;

export function serve({ outputDir }: ServeOptions): oak.Middleware {
  return async (context) => {
    await oak.send(context, context.request.url.pathname, {
      root: outputDir,
      index: "index.html",
    });
  };
}
