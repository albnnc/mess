import { bytes, compress, esbuild, esbuildPluginHttp } from "./deps.ts";
import { log } from "./deps.ts";

export interface SizeModuleOptions {
  esbuildPlugins?: esbuild.Plugin[];
  logger?: log.Logger;
}

export async function sizeModule(
  modulePath: string,
  { esbuildPlugins, logger }: SizeModuleOptions = {}
) {
  const {
    outputFiles: [{ contents }],
  } = await esbuild.build({
    entryPoints: [modulePath],
    write: false,
    bundle: true,
    minify: true,
    plugins: esbuildPlugins ?? [await esbuildPluginHttp.create()],
  });
  esbuild.stop();
  const compressedContents = compress.gzip(contents);
  const size = bytes.prettyBytes(contents.length);
  const gzipSize = bytes.prettyBytes(compressedContents.length);
  if (logger) {
    logger.info(`Size: ${size}`);
    logger.info(`Gzip Size: ${gzipSize}`);
  }
  return { size, gzipSize };
}
