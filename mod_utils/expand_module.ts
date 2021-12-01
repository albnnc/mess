import { path, denoGraph } from "./deps.ts";

export async function expandModule(modulePath: string) {
  const absoluteModulePath = path.resolve(Deno.cwd(), modulePath);
  const specifier = path.toFileUrl(absoluteModulePath).toString();
  const { modules } = await denoGraph.createGraph(specifier, {
    load: async (specifier: string) => {
      if (!specifier.startsWith("file://")) {
        return undefined;
      }
      const filePath = path.fromFileUrl(specifier);
      return {
        specifier,
        content: await Deno.readTextFile(filePath),
      };
    },
  });
  const filePaths = modules.map((v) => path.fromFileUrl(v.specifier));
  if (filePaths.length < 0) {
    filePaths.push(absoluteModulePath);
  }
  const commonDir = path.common(filePaths);
  return { filePaths, commonDir };
}
