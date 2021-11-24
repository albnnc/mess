import { BuildOptions } from "./build.ts";
import { http, log, path, serveFile } from "./deps.ts";

export interface ServeOptions extends Pick<BuildOptions, "outputDir"> {
  serveAddress?: string;
}

export async function serve({
  outputDir,
  serveAddress = "localhost:1234",
}: ServeOptions) {
  log.info(`serving on ${serveAddress}`);
  await http.serve(
    async (req) => {
      const { pathname } = new URL(req.url);
      let filePath = path.join(outputDir, pathname);
      if (
        await Deno.lstat(filePath)
          .then((v) => v.isDirectory)
          .catch(() => false)
      ) {
        filePath = path.join(filePath, "index.html");
      }
      return serveFile(req, filePath);
    },
    { addr: serveAddress }
  );
}
