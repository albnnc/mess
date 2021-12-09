import { ToneMeta } from "./build_tone.ts";
import { path, esbuild, log, fs, esbuildPluginHttp } from "./deps.ts";

export interface BuildUiOptions {
  outputDir: string;
  tones: Map<string, ToneMeta>;
}

export async function buildUi({ outputDir, tones }: BuildUiOptions) {
  log.info("Building main UI");
  const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
  await fs.ensureDir(outputDir);
  await Deno.writeTextFile(
    path.join(outputDir, "index.html"),
    getIndexHtml(tones)
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

const getIndexHtml = (tones: BuildUiOptions["tones"]) => `
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
      <script>globalThis.TONEBOOK_TONES = ${JSON.stringify(
        Array.from(tones).map(([_, v]) => v)
      )}</script>
    </body>
  </html>
`;
