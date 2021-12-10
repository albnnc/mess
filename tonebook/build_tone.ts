import { path, fs, log } from "./deps.ts";
import { describeTone } from "./describe_tone.ts";

export interface ToneContent {
  files: Record<string, string>;
}

export interface BuildToneOptions {
  entry: string;
  outputDir: string;
  processEntry: (entry: string) => Promise<ToneContent>;
}

export async function buildTone({
  entry,
  outputDir,
  processEntry,
}: BuildToneOptions) {
  log.info(`Building entry "${entry}"`);
  const { id } = describeTone(entry);
  try {
    const { files } = await processEntry(entry);
    const toneDir = path.join(outputDir, "tones", id);
    if (
      await Deno.lstat(toneDir)
        .then(() => true)
        .catch(() => false)
    ) {
      // Removing existing entry before writing output.
      await Deno.remove(toneDir, { recursive: true });
    }
    await fs.ensureDir(toneDir);
    await Promise.all(
      Object.entries(files).map(async ([file, content]) => {
        const filePath = path.join(toneDir, file);
        const fileDir = path.dirname(filePath);
        await fs.ensureDir(fileDir);
        await Deno.writeTextFile(filePath, content);
      })
    );
  } catch (e) {
    log.error(`Error while building "${entry}":\n${e.message ?? e}`);
  }
}
