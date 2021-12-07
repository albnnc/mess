#!/usr/bin/env -S deno run -A --no-check
import * as path from "https://deno.land/std@0.115.1/path/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.13.14/mod.js";
import * as esbuildPluginHttp from "../esbuild_plugin_http/mod.ts";
import * as pad from "../pad/mod.ts";

const isDev = Deno.args.includes("dev");
const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
const inputDir = path.join(currentDir, "./sheets");
const outputDir = path.join(currentDir, "./build");
const indexHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Cobalt Essentials</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: rgb(20, 20, 20);
          color: rgb(200, 200, 200);
        }
      </style>
    </head>
    <body>
      <script type="module" src="index.js"></script>
      <app-root></app-root>
      ${isDev ? `<script>${pad.reloadScript}</script>` : ""}
    </body>
  </html>
`;

await pad.make({
  isDev,
  outputDir,
  entries: path.join(inputDir, "*.ts"),
  processEntry: async (entry) => {
    const { outputFiles } = await esbuild.build({
      entryPoints: [entry],
      write: false,
      bundle: true,
      minify: !isDev,
      plugins: [await esbuildPluginHttp.create()],
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
