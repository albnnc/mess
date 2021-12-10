import { serve } from "./serve.ts";
import { watch, WatchOptions } from "./watch.ts";
import { build, BuildOptions } from "./build.ts";
import { oak } from "./deps.ts";

export interface MakeOptions
  extends Pick<BuildOptions, "entries" | "outputDir" | "processEntry">,
    Pick<WatchOptions, "watchDebounceTime"> {
  dev?: boolean;
  port?: number;
}

export async function make({
  dev,
  port = 1234,
  outputDir,
  entries,
  processEntry,
}: MakeOptions) {
  const toneDescriptions = await build({
    dev: !!dev,
    outputDir,
    entries,
    processEntry,
  });
  if (dev) {
    const app = new oak.Application({ logErrors: false });
    app.use(
      await watch({
        toneDescriptions,
        entries,
        outputDir,
        processEntry,
      })
    );
    app.use(serve({ outputDir }));
    await app.listen({ port });
  }
}
