import { async } from "./deps.ts";
import { expandModule } from "./expand_module.ts";

export function watchModule(modulePath: string) {
  return {
    close: () => {},
    async *[Symbol.asyncIterator]() {
      const iterable = new async.MuxAsyncIterator<Deno.FsEvent>();
      let meta = await expandModule(modulePath);
      let watcher = Deno.watchFs(meta.commonDir);
      this.close = watcher.close;
      iterable.add(watcher);
      for await (const event of iterable) {
        if (event.paths.every((v) => !meta.filePaths.includes(v))) {
          continue;
        }
        yield event;
        const nextMeta = await expandModule(modulePath);
        if (nextMeta.commonDir !== meta.commonDir) {
          const nextWatcher = Deno.watchFs(nextMeta.commonDir);
          iterable.add(nextWatcher);
          watcher.close();
          meta = nextMeta;
          watcher = nextWatcher;
          this.close = watcher.close;
        }
      }
    },
  };
}
