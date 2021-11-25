import { BuildOptions } from "./build.ts";
import { buildSheet } from "./build_sheet.ts";
import { async, log, path } from "./deps.ts";
import { getGlobDir } from "./get_glob_dir.ts";

export interface WatchOptions
  extends Pick<BuildOptions, "outputDir" | "entries" | "processEntry"> {
  watchDir?: string;
  watchDebounceTime?: number;
}

export async function watch({
  outputDir,
  entries,
  processEntry,
  watchDir,
  watchDebounceTime = 300,
}: WatchOptions) {
  watchDir = watchDir ?? (await getGlobDir(entries));
  log.info(`watching changes in \`${watchDir}\``);
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
      const fn = async.debounce(() => {
        buildSheet({
          entry: v,
          outputDir,
          processEntry,
        });
      }, watchDebounceTime);
      fn();
      fileUpdateHandlers.set(v, fn);
    }
  };
  const watcher = Deno.watchFs(watchDir);
  for await (const event of watcher) {
    event.paths
      .filter((v) => entryRegExp.test(v))
      .forEach((v) => {
        updateFile(v);
      });
  }
}
