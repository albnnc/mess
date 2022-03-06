import { log, oak } from "./deps.ts";
import { buildClient } from "./build_client.ts";
import { serve, ServeOptions } from "./serve.ts";
import { watchClient } from "./watch_client.ts";

export interface StartOptions extends Pick<ServeOptions, "getPageContent"> {
  dev?: boolean;
  port?: number;
  clientEntry?: string;
  clientDir: string;
}

export async function start({
  dev,
  port = 1234,
  clientEntry,
  clientDir,
  getPageContent,
}: StartOptions) {
  log.info("Starting server");
  const app = new oak.Application({ logErrors: false });
  if (dev) {
    if (!clientEntry) {
      throw new Error("When `dev` is true, `clientEntry` must be specified");
    }
    await buildClient({
      dev,
      entry: clientEntry,
      outputDir: clientDir,
    });
    app.use(
      watchClient({
        entry: clientEntry,
        outputDir: clientDir,
      })
    );
  }
  app.use(
    serve({
      clientDir,
      getPageContent,
    })
  );
  await app.listen({ port });
}
