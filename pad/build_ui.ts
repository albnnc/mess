import { path, esbuild, log, fs, esbuildPluginHttp } from "./deps.ts";

export async function buildUi(outputDir: string) {
  log.info("building pad UI");
  const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
  await fs.ensureDir(outputDir);
  await Deno.writeTextFile(path.join(outputDir, "index.html"), indexHtml);
  await esbuild.build({
    entryPoints: [path.join(currentDir, "ui/index.ts")],
    outdir: outputDir,
    write: true,
    bundle: true,
    minify: true,
    plugins: [esbuildPluginHttp.createPlugin()],
  });
  esbuild.stop();
}

const indexHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Color Pad</title>
    </head>
    <body>
      <script type="module" src="index.js"></script>
      <app-root></app-root>
    </body>
  </html>
`;
