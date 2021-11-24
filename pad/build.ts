import { fs } from "./deps.ts";
import { buildUi } from "./build_ui.ts";
import { buildSheet, ProcessedSheetEntry } from "./build_sheet.ts";

export interface BuildOptions {
  outputDir: string;
  entries: string;
  processEntry: (entry: string) => Promise<ProcessedSheetEntry>;
}

export async function build({
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
  await buildUi(outputDir);
  for await (const v of fs.expandGlob(entries)) {
    if (!v.isFile) {
      return;
    }
    await buildSheet({
      entry: v.path,
      outputDir,
      processEntry,
    });
  }
}
