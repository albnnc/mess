import { serve } from "./serve.ts";
import { watch, WatchOptions } from "./watch.ts";
import { build, BuildOptions } from "./build.ts";
import { oak } from "./deps.ts";

export interface MakeOptions extends BuildOptions, WatchOptions {
  isDev?: boolean;
  port?: number;
}

export async function make({
  isDev,
  port = 1234,
  outputDir,
  entries,
  processEntry,
}: MakeOptions) {
  const tones = await build({
    outputDir,
    entries,
    processEntry,
  });
  if (isDev) {
    const app = new oak.Application({ logErrors: false });
    app.use(
      await watch({
        tones,
        entries,
        outputDir,
        processEntry,
      })
    );
    app.use(serve({ outputDir }));
    await app.listen({ port });
  }
}
