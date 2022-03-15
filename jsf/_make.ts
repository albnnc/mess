#!/usr/bin/env -S deno run -A --no-check
import * as path from "https://deno.land/std@0.121.0/path/mod.ts";
import * as log from "https://deno.land/std@0.121.0/log/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.14.25/mod.js";
import * as tonebook from "../tonebook/mod.ts";
import * as make from "../make/mod.ts";
import * as mod from "../mod/mod.ts";

const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
const inputDir = path.join(currentDir, "./_tones");
const outputDir = path.join(currentDir, "./_build");

async function buildTonebook(dev?: boolean) {
  const indexHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Palet</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            color: rgb(200, 200, 200);
            font-family: Arial, sans-serif;
          }
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 100vh;
          }
        </style>
      </head>
      <body>
        <script type="module" src="index.js"></script>
        <div class="container">
          <tone-root></tone-root>
        </div>
        ${dev ? `<script>${tonebook.createReloadScript()}</script>` : ""}
      </body>
    </html>
  `;
  await tonebook.build({
    dev,
    outputDir,
    entries: path.join(inputDir, "*.ts"),
    processEntry: async (entry) => {
      const { outputFiles } = await esbuild.build({
        entryPoints: [entry],
        write: false,
        bundle: true,
        minify: !dev,
        plugins: [await mod.createEsbuildPluginHttp()],
      });
      const decoder = new TextDecoder();
      const indexJs = outputFiles.find((v) => v.path === "<stdout>");
      return {
        name: path
          .basename(entry, ".ts")
          .replace(/[\W]/g, "")
          .replace(/[\s_-]+/, " "),
        files: {
          "index.html": indexHtml,
          "index.js": decoder.decode(indexJs?.contents),
        },
      };
    },
  });
  esbuild.stop();
}

make.task("dev", () => buildTonebook(true));
make.task("doc", () => buildTonebook(false));
make.task("size", async () => {
  await mod.sizeModule(path.join(currentDir, "mod.ts"), {
    logger: log.getLogger(),
  });
});
await make.exec(Deno.args);
