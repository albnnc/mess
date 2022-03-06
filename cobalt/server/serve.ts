import { oak } from "./deps.ts";

export interface ServeOptions {
  clientDir: string;
  getPageContent: (context: oak.Context) => string;
}

export function serve({
  clientDir,
  getPageContent,
}: ServeOptions): oak.Middleware {
  return async (context) => {
    const { pathname } = context.request.url;
    if (!pathname.includes(".")) {
      context.response.body = getPageContent(context);
    } else {
      await oak.send(context, pathname, { root: clientDir });
    }
  };
}
