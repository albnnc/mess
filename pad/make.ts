import { watch, WatchOptions } from "./watch.ts";
import { serve, ServeOptions } from "./serve.ts";
import { build, BuildOptions } from "./build.ts";

export interface MakeOptions extends BuildOptions, WatchOptions, ServeOptions {
  isDev?: boolean;
}

export async function make({ isDev, ...rest }: MakeOptions) {
  await build(rest);
  if (isDev) {
    await Promise.all([watch(rest), serve(rest)]);
  }
}
