import { path, fs, log } from "./deps.ts";
import { hashString } from "./hash_string.ts";

export interface ProcessedSheetEntry {
  id: string;
  files: Record<string, string>;
}

export interface BuildSheetOptions {
  entry: string;
  outputDir: string;
  processEntry: (entry: string) => Promise<ProcessedSheetEntry>;
}

export async function buildSheet({
  entry,
  outputDir,
  processEntry,
}: BuildSheetOptions) {
  log.info(`building sheet \`${entry}\``);
  const { id, files } = await processEntry(entry);
  const hash = await hashString(id);
  const sheetDir = path.join(outputDir, `sheets/${hash}`);
  await fs.ensureDir(sheetDir);
  await Promise.all(
    Object.entries(files).map(async ([file, content]) => {
      const filePath = path.join(sheetDir, file);
      const fileDir = path.dirname(filePath);
      await fs.ensureDir(fileDir);
      await Deno.writeTextFile(filePath, content);
    })
  );
}
