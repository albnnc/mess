import { path, fs, esbuild } from "./deps.ts";

export async function buildUi(outputDir: string) {
  const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
  const publicDir = path.join(currentDir, "ui/public");
  for await (const entry of fs.walk(publicDir)) {
    if (!entry.isFile) {
      continue;
    }
    const relativePath = path.relative(publicDir, entry.path);
    const bytes = await Deno.readFile(entry.path);
    await fs.ensureDir(path.join(outputDir, path.dirname(relativePath)));
    await Deno.writeFile(path.join(outputDir, relativePath), bytes);
  }
  await esbuild.build({
    entryPoints: [path.join(currentDir, "ui/index.ts")],
    outdir: outputDir,
    write: true,
    bundle: true,
  });
  esbuild.stop();
}
