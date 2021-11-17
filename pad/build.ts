import { path, esbuild } from "./deps.ts";

export async function build() {
  const uiDir = path.fromFileUrl(new URL("ui", import.meta.url));
  const publicDir = path.join(uiDir, "public");
  const indexFile = path.join(uiDir, "index.ts");

  await esbuild.serve(
    {
      host: "127.0.0.1",
      port: 1234,
      servedir: publicDir,
    },
    {
      entryPoints: [indexFile],
      bundle: true,
    }
  );
}
