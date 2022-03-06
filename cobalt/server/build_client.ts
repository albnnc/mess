import { mod, esbuild, log } from "./deps.ts";

export interface BuildClientOptions {
  dev?: boolean;
  entry: string;
  outputDir: string;
}

export async function buildClient({
  dev,
  entry,
  outputDir,
}: BuildClientOptions) {
  log.info("Building client");
  if (
    await Deno.lstat(outputDir)
      .then(() => true)
      .catch(() => false)
  ) {
    await Deno.remove(outputDir, { recursive: true });
  }
  await esbuild.build({
    entryPoints: [entry],
    minify: !dev,
    bundle: true,
    write: true,
    outdir: outputDir,
    plugins: [await mod.createEsbuildPluginHttp()],
  });
  esbuild.stop();
}
