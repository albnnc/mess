import { fs, oak } from "./deps.ts";
import { buildUi } from "./build_ui.ts";
import { buildTone, ToneContent } from "./build_tone.ts";
import { describeTone } from "./describe_tone.ts";
import { watch } from "./watch.ts";
import { serve } from "./serve.ts";

export interface BuildOptions {
  entries: string;
  outputDir: string;
  processEntry: (entry: string) => Promise<ToneContent>;
  dev?: boolean;
  port?: number;
}

export async function build({
  entries,
  outputDir,
  processEntry,
  dev,
  port = 1234,
}: BuildOptions) {
  if (
    await Deno.lstat(outputDir)
      .then(() => true)
      .catch(() => false)
  ) {
    await Deno.remove(outputDir, { recursive: true });
  }
  const files: string[] = [];
  for await (const v of fs.expandGlob(entries)) {
    if (v.isFile) {
      files.push(v.path);
    }
  }
  const toneDescriptions = files.map((v) => describeTone(v));
  // One has to separate main UI building and
  // tones building since the first one stops
  // esbuild instance while other could use it.
  await buildUi({ dev, toneDescriptions, outputDir });
  await Promise.all(
    files.map((v) =>
      buildTone({
        entry: v,
        outputDir,
        processEntry,
      })
    )
  );
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
