import { path, ModuleGraphJson } from "./deps.ts";

export async function expandModule(modulePath: string) {
  const absoluteModulePath = path.resolve(Deno.cwd(), modulePath);
  const process = Deno.run({
    cmd: ["deno", "info", absoluteModulePath, "--json"],
    stdout: "piped",
    stderr: "piped",
  });
  const [raw] = await Promise.all([process.output(), process.status()]);
  const { modules } = JSON.parse(
    new TextDecoder().decode(raw)
  ) as ModuleGraphJson;
  // One should use deno_graph when it will be able to cache its WASM.
  // See: https://deno.land/x/deno_graph@0.18.0/lib/deno_graph.generated.js#L842
  //
  // const specifier = path.toFileUrl(absoluteModulePath).toString();
  // const { modules } = await denoGraph.createGraph(specifier, {
  //   load: async (specifier: string) => {
  //     if (!specifier.startsWith("file://")) {
  //       return undefined;
  //     }
  //     const filePath = path.fromFileUrl(specifier);
  //     return {
  //       specifier,
  //       content: await Deno.readTextFile(filePath),
  //     };
  //   },
  // });
  const filePaths = modules
    .map((v) => v.specifier)
    .filter((v) => v.startsWith("file://"))
    .map((v) => path.fromFileUrl(v));
  if (filePaths.length < 0) {
    filePaths.push(absoluteModulePath);
  }
  const commonDir = path.common(filePaths);
  return { filePaths, commonDir };
}
