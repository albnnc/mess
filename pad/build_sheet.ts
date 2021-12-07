import { cyrb53 } from "./cyrb53.ts";
import { path, fs, log } from "./deps.ts";

export interface ProcessedSheetEntry {
  name: string;
  files: Record<string, string>;
}

export interface BuildSheetOptions {
  entry: string;
  outputDir: string;
  processEntry: (entry: string) => Promise<ProcessedSheetEntry>;
}

export interface BuildSheetResult {
  id: string;
  name: string;
}

export async function buildSheet({
  entry,
  outputDir,
  processEntry,
}: BuildSheetOptions): Promise<BuildSheetResult> {
  log.info(`building sheet \`${entry}\``);
  const { name, files } = await processEntry(entry);
  const id = cyrb53(entry).toString();
  const sheetDir = path.join(outputDir, `sheets/${id}`);
  await fs.ensureDir(sheetDir);
  await Promise.all(
    Object.entries(files).map(async ([file, content]) => {
      const filePath = path.join(sheetDir, file);
      const fileDir = path.dirname(filePath);
      await fs.ensureDir(fileDir);
      await Deno.writeTextFile(filePath, content);
    })
  );
  return { id, name };
}
