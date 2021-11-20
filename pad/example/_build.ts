import { esbuild, path } from "../deps.ts";
import { build } from "../build.ts";

const baseDir = path.fromFileUrl(new URL("sheets", import.meta.url));
const indexHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <base href=".">
      <title>Cobalt</title>
    </head>
    <body>
      <script type="module" src="/index.js"></script>
      <app-root></app-root>
    </body>
  </html>
`;

await build({
  entries: path.join(baseDir, "*.ts"),
  processEntry: async (entry) => {
    const { outputFiles } = await esbuild.build({
      entryPoints: [entry],
      write: false,
      bundle: true,
    });
    esbuild.stop();
    const decoder = new TextDecoder();
    const indexJs = outputFiles.find((v) => v.path === "<stdout>");
    return {
      id: entry,
      files: {
        "/index.html": indexHtml,
        "/index.js": decoder.decode(indexJs?.contents),
      },
    };
  },
});
