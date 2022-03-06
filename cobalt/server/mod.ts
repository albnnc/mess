import { path } from "./deps.ts";
import { getPageContent } from "./get_page_content.ts";
import { start } from "./start.ts";

if (import.meta.main) {
  const dev = !!Deno.args[0];
  const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
  const clientDir = Deno.args[0] ?? path.join(currentDir, "client");
  const clientEntry = path.resolve(currentDir, "../client/mod.ts");
  start({
    dev,
    clientEntry,
    clientDir,
    getPageContent,
  });
}

export * from "./build_client.ts";
export * from "./serve.ts";
export * from "./start.ts";
export * from "./watch_client.ts";
