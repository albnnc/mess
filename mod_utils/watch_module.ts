import { async } from "./deps.ts";
import { expandModule } from "./expand_module.ts";

export function watchModule(modulePath: string) {
  let isClosed = false;
  return {
    close: () => {
      isClosed = true;
    },
    async *[Symbol.asyncIterator]() {
      if (isClosed) {
        return;
      }
      const iterable = new async.MuxAsyncIterator<Deno.FsEvent>();
      let meta = await expandModule(modulePath);
      let watcher = Deno.watchFs(meta.commonDir);
      this.close = () => {
        isClosed = true;
        watcher.close();
      };
      iterable.add(watcher);
      for await (const event of iterable) {
        if (isClosed) {
          break;
        }
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
          this.close = () => {
            isClosed = true;
            watcher.close();
          };
        }
      }
    },
  };
}
