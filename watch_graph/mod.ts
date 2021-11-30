import { denoGraph, path } from "./deps.ts";

export async function watchGraph(input: string) {
  if (
    await Deno.lstat(input)
      .then(() => false)
      .catch(() => true)
  ) {
    return;
  }
  const specifier = path.toFileUrl(path.join(Deno.cwd(), input)).toString();
  const { modules } = await denoGraph.createGraph(specifier, {
    load: async (specifier: string) => {
      if (!specifier.startsWith("file:///")) {
        return undefined;
      }
      const filePath = specifier.replace("file:///", "");
      return {
        specifier,
        content: await Deno.readTextFile(filePath),
      };
    },
  });
  const specifiers = modules.map((v) => v.specifier);
  console.log("specifiers", specifiers);
}

await watchGraph("./cobalt_essentials/mod.ts");
