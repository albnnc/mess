import { BuildOptions } from "./build.ts";
import { buildTone } from "./build_tone.ts";
import { async, fs, modUtils, oak } from "./deps.ts";

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
      target.addEventListener("close", () => {
        sseTargets.delete(target);
      });
      sseTargets.add(target);
    } else {
      await next();
    }
  };
  const watchEntry = async (entry: string) => {
    const handle = async.debounce(async () => {
      const sheet = await buildTone({
        entry,
        outputDir,
        processEntry,
      });
      Array.from(sseTargets).map((v) => v.dispatchMessage(sheet));
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
