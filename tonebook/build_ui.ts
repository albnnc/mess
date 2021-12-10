import { createReloadScript } from "./create_reload_script.ts";
import { path, esbuild, log, fs, esbuildPluginHttp } from "./deps.ts";
import { ToneDescription } from "./describe_tone.ts";

export interface BuildUiOptions {
  dev: boolean;
  outputDir: string;
  toneDescriptions: ToneDescription[];
}

export async function buildUi({
  dev,
  toneDescriptions,
  outputDir,
}: BuildUiOptions) {
  log.info("Building main UI");
  const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
  await fs.ensureDir(outputDir);
  await Deno.writeTextFile(
    path.join(outputDir, "index.html"),
    createIndexHtml({ dev, toneDescriptions })
  );
  await esbuild.build({
    entryPoints: [path.join(currentDir, "ui/index.ts")],
    outdir: outputDir,
    write: true,
    bundle: true,
    minify: true,
    plugins: [await esbuildPluginHttp.create()],
  });
  esbuild.stop();
}

const createIndexHtml = (options: {
  dev: boolean;
  toneDescriptions: ToneDescription[];
}) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Tones</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
      <style>
        html, body {
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <app-root></app-root>
      <script type="module" src="index.js"></script>
      <script>
        globalThis.TONEBOOK_TONE_DESCRIPTIONS =
        ${JSON.stringify(options.toneDescriptions, null, 2)
          .split("\n")
          .join("\n        ")};
      </script>
      ${options.dev ? `<script>${createReloadScript(true)}</script>` : ""}
    </body>
  </html>
`;
