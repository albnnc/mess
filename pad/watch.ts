import { BuildOptions } from "./build.ts";
import { buildSheet } from "./build_sheet.ts";
import { async, fs, modUtils, oak } from "./deps.ts";
import { hashString } from "./hash_string.ts";

export interface WatchOptions
  extends Pick<BuildOptions, "outputDir" | "entries" | "processEntry"> {
  watchDebounceTime?: number;
}

export function watch({
  outputDir,
  entries,
  processEntry,
  watchDebounceTime = 100,
}: WatchOptions): oak.Middleware {
  const sseTargets = new Set<oak.ServerSentEventTarget>();
  const middleware: oak.Middleware = async (context, next) => {
    if (context.request.url.pathname.startsWith("/updates")) {
      const target = context.sendEvents();
      target.addEventListener("close", () => sseTargets.delete(target));
      sseTargets.add(target);
    } else {
      await next();
    }
  };
  const watchEntry = async (entry: string) => {
    const handle = async.debounce(async () => {
      await buildSheet({
        entry,
        outputDir,
        processEntry,
      });
      await Promise.all(
        Array.from(sseTargets).map(async (v) =>
          v.dispatchMessage({
            entry,
            id: await hashString(entry),
          })
        )
      );
    }, watchDebounceTime);
    for await (const _ of modUtils.watchModule(entry)) {
      handle();
    }
  };
  const watch = async () => {
    for await (const entry of fs.expandGlob(entries)) {
      watchEntry(entry.path);
    }
  };
  watch();
  return middleware;
}
