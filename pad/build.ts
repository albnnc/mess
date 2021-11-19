import { fs, path } from "./deps.ts";
import { hashString } from "./hash_string.ts";
import { buildUi } from "./build_ui.ts";

interface ProcessedEntry {
  id: string;
  files: Record<string, string>;
}

interface BuildOptions {
  entries: string;
  processEntry: (entry: string) => Promise<ProcessedEntry>;
}

export async function build({ entries, processEntry }: BuildOptions) {
  const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
  const distDir = path.join(currentDir, "build");
  if (
    await Deno.lstat(distDir)
      .then(() => true)
      .catch(() => false)
  ) {
    await Deno.remove(distDir, { recursive: true });
  }
  await buildUi(distDir);
  for await (const entry of fs.expandGlob(entries)) {
    if (!entry.isFile) {
      return;
    }
    const { id, files } = await processEntry(entry.path);
    const hash = await hashString(id);
    const sheetDir = path.join(distDir, `sheets/${hash}`);
    await fs.ensureDir(sheetDir);
    for (const [file, content] of Object.entries(files)) {
      const filePath = path.join(sheetDir, file);
      const fileDir = path.dirname(filePath);
      await fs.ensureDir(fileDir);
      await Deno.writeTextFile(filePath, content);
    }
  }
}
