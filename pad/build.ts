import { fs, path, http, serveFile, debounce } from "./deps.ts";
import { buildUi } from "./build_ui.ts";
import { getGlobDir } from "./get_glob_dir.ts";
import { BuildOptions } from "./types.ts";
import { buildSheet } from "./build_sheet.ts";

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

  const entryRegExp = path.globToRegExp(entries, {
    extended: true,
    globstar: true,
    caseInsensitive: false,
  });
  const fileUpdateHandlers = new Map<string, () => void>();
  const updateFile = (v: string) => {
    const fn = fileUpdateHandlers.get(v);
    if (fn) {
      fn();
    } else {
      const fn = debounce(() => {
        buildSheet({
          entry: v,
          outputDir,
          processEntry,
        });
      }, 300);
      fn();
      fileUpdateHandlers.set(v, fn);
    }
  };
  const dirToWatch = await getGlobDir(entries);
  const watcher = Deno.watchFs(dirToWatch);
  for await (const event of watcher) {
    event.paths
      .filter((v) => entryRegExp.test(v))
      .forEach((v) => {
        updateFile(v);
      });
  }

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
