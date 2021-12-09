import { BuildOptions } from "./build.ts";
import { buildTone } from "./build_tone.ts";
import { buildUi, BuildUiOptions } from "./build_ui.ts";
import { cyrb53 } from "./cyrb53.ts";
import { async, fs, log, modUtils, oak, path } from "./deps.ts";

export interface WatchOptions
  extends Pick<BuildOptions, "outputDir" | "entries" | "processEntry">,
    Pick<BuildUiOptions, "tones"> {
  watchDebounceTime?: number;
}

export async function watch({
  tones,
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
      if (
        event.kind === "modify" ||
        event.kind === "create" ||
        (event.kind === "remove" &&
          event.paths.every((v) => !entriesRegExp.test(v)))
      ) {
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
      if (!event.paths.some((v) => entriesRegExp.test(v))) {
        continue;
      }
      if (event.kind === "create") {
        for (const entry of event.paths) {
          const tone = await buildTone({
            entry,
            outputDir,
            processEntry,
          });
          tones.set(tone.id, tone);
        }
        break;
      }
      if (event.kind === "remove") {
        for (const entry of event.paths) {
          log.info(`Dropping "${entry}"`);
          const toneId = "tone_" + cyrb53(entry);
          const toneDir = path.join(outputDir, "tones", toneId);
          await Deno.remove(toneDir, { recursive: true });
          tones.delete(toneId);
        }
        break;
      }
    }
    await buildUi({ outputDir, tones });
    Array.from(sseTargets).map((v) =>
      v.dispatchMessage({ id: "root", name: "root" })
    );
    watch();
  };
  watch();
  return middleware;
}
