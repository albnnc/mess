import { fs, path, http, serveFile } from "./deps.ts";
import { hashString } from "./hash_string.ts";
import { buildUi } from "./build_ui.ts";
import { getGlobDir } from "./get_glob_dir.ts";

interface ProcessedEntry {
  id: string;
  files: Record<string, string>;
}

interface BuildOptions {
  watch: boolean;
  entries: string;
  processEntry: (entry: string) => Promise<ProcessedEntry>;
}

export async function build({ entries, processEntry }: BuildOptions) {
  const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
  const outputDir = path.join(currentDir, "build");
  if (
    await Deno.lstat(outputDir)
      .then(() => true)
      .catch(() => false)
  ) {
    await Deno.remove(outputDir, { recursive: true });
  }
  await buildUi(outputDir);
  for await (const entry of fs.expandGlob(entries)) {
    if (!entry.isFile) {
      return;
    }
    const { id, files } = await processEntry(entry.path);
    const hash = await hashString(id);
    const sheetDir = path.join(outputDir, `sheets/${hash}`);
    await fs.ensureDir(sheetDir);
    for (const [file, content] of Object.entries(files)) {
      const filePath = path.join(sheetDir, file);
      const fileDir = path.dirname(filePath);
      await fs.ensureDir(fileDir);
      await Deno.writeTextFile(filePath, content);
    }
  }

  // const dirToWatch = await getGlobDir(entries);
  // const watcher = Deno.watchFs(dirToWatch);
  // for await (const event of watcher) {
  //   console.log("sheet changed", event);
  // }

  // http.serve(
  //   async (req) => {
  //     const { pathname } = new URL(req.url);
  //     let filePath = path.join(outputDir, pathname);
  //     if (
  //       await Deno.lstat(filePath)
  //         .then((v) => v.isDirectory)
  //         .catch(() => false)
  //     ) {
  //       filePath = path.join(filePath, "index.html");
  //     }
  //     return serveFile(req, filePath);
  //   },
  //   { addr: "127.0.0.1:1234" }
  // );
}
