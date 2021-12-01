import { BuildOptions } from "./build.ts";
import { buildSheet } from "./build_sheet.ts";
import { async, fs, log, modUtils } from "./deps.ts";

export interface WatchOptions
  extends Pick<BuildOptions, "outputDir" | "entries" | "processEntry"> {
  watchDebounceTime?: number;
}

export async function watch({
  outputDir,
  entries,
  processEntry,
  watchDebounceTime = 300,
}: WatchOptions) {
  log.info(`watching changes`);
  // const entryRegExp = path.globToRegExp(entries, {
  //   extended: true,
  //   globstar: true,
  //   caseInsensitive: false,
  // });
  const watchEntry = async (entry: string) => {
    const handle = async.debounce(() => {
      buildSheet({
        entry,
        outputDir,
        processEntry,
      });
    }, watchDebounceTime);
    for await (const _ of modUtils.watchModule(entry)) {
      handle();
    }
  };
  for await (const entry of fs.expandGlob(entries)) {
    watchEntry(entry.path);
  }
}
