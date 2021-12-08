#!/usr/bin/env -S deno run -A --no-check
import { esbuild, path } from "../deps.ts";
import { make } from "../make.ts";

const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
const outputDir = path.join(currentDir, "../build");
const baseDir = path.fromFileUrl(new URL("tones", import.meta.url));
const indexHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Cobalt</title>
    </head>
    <body>
      <script type="module" src="index.js"></script>
      <app-root></app-root>
    </body>
  </html>
`;
const isDev = Deno.args.includes("dev");

await make({
  isDev,
  outputDir,
  entries: path.join(baseDir, "*.ts"),
  processEntry: async (entry) => {
    const { outputFiles } = await esbuild.build({
      entryPoints: [entry],
      write: false,
      bundle: true,
      minify: !isDev,
    });
    esbuild.stop();
    const decoder = new TextDecoder();
    const indexJs = outputFiles.find((v) => v.path === "<stdout>");
    return {
      name: path.basename(entry),
      files: {
        "index.html": indexHtml,
        "index.js": decoder.decode(indexJs?.contents),
      },
    };
  },
});
