import { path, fs } from "./deps.ts";
import { hashString } from "./hash_string.ts";
import { BuildSheetOptions } from "./types.ts";

export async function buildSheet({
  entry,
  outputDir,
  processEntry,
}: BuildSheetOptions) {
  console.log("Building", entry);
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
