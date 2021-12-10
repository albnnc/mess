import { fs } from "./deps.ts";
import { buildUi } from "./build_ui.ts";
import { buildTone, ToneContent } from "./build_tone.ts";
import { describeTone } from "./describe_tone.ts";

export interface BuildOptions {
  dev: boolean;
  entries: string;
  outputDir: string;
  processEntry: (entry: string) => Promise<ToneContent>;
}

export async function build({
  dev,
  outputDir,
  entries,
  processEntry,
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
  await Promise.all([
    buildUi({ dev, toneDescriptions, outputDir }),
    ...files.map((v) =>
      buildTone({
        entry: v,
        outputDir,
        processEntry,
      })
    ),
  ]);
  return toneDescriptions;
}
