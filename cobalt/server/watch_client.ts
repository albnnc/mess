import { async, mod, oak } from "./deps.ts";
import { buildClient } from "./build_client.ts";

export interface WatchClientOptions {
  entry: string;
  outputDir: string;
  watchDebounceTime?: number;
}

export function watchClient({
  entry,
  outputDir,
  watchDebounceTime = 100,
}: WatchClientOptions): oak.Middleware {
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
  const watchEntry = async () => {
    const watcher = mod.watchModule(entry);
    const handle = async.debounce(
      () =>
        buildClient({
          dev: true,
          entry,
          outputDir,
        }),
      watchDebounceTime
    );
    for await (const event of watcher) {
      if (
        event.kind === "modify" ||
        event.kind === "create" ||
        event.kind === "remove"
      ) {
        handle();
      }
    }
  };
  watchEntry();
  return middleware;
}
