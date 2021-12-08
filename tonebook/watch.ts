import { build, BuildOptions } from "./build.ts";
import { buildTone } from "./build_tone.ts";
import { async, fs, modUtils, oak, path } from "./deps.ts";

export interface WatchOptions
  extends Pick<BuildOptions, "outputDir" | "entries" | "processEntry"> {
  watchDebounceTime?: number;
}

export async function watch({
  outputDir,
  entries,
  processEntry,
  watchDebounceTime = 100,
}: WatchOptions): Promise<oak.Middleware> {
  const entriesRegExp = path.globToRegExp(entries);
  let entriesDir = entries;
  while (true) {
    if (
      await Deno.lstat(entriesDir)
        .then((v) => v.isDirectory)
        .catch(() => false)
    ) {
      break;
    }
    entriesDir = path.dirname(entriesDir);
  }
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
  const watchers = new Set<ReturnType<typeof modUtils.watchModule>>();
  const watchEntry = async (entry: string) => {
    const handle = async.debounce(async () => {
      const tone = await buildTone({
        entry,
        outputDir,
        processEntry,
      });
      Array.from(sseTargets).map((v) => v.dispatchMessage(tone));
    }, watchDebounceTime);
    const watcher = modUtils.watchModule(entry);
    watchers.add(watcher);
    for await (const event of watcher) {
      if (["modify", "create", "remove"].includes(event.kind)) {
        handle();
      }
    }
  };
  const startWatching = async () => {
    for await (const entry of fs.expandGlob(entries)) {
      watchEntry(entry.path);
    }
  };
  const watch = async () => {
    watchers.forEach((v) => v.close());
    watchers.clear();
    startWatching();
    for await (const event of Deno.watchFs(entriesDir)) {
      if (
        ["create", "remove"].includes(event.kind) &&
        event.paths.some((v) => entriesRegExp.test(v))
      ) {
        break;
      }
    }
    // TODO: Restart here.
    watch();
  };
  watch();
  return middleware;
}
