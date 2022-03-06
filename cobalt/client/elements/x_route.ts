import {
  createCustomElement,
  TemplateNode,
  urlPattern,
  useMemo,
  useProp,
} from "../deps.ts";
import { useLocation } from "../hooks/mod.ts";

export const XRoute = createCustomElement(() => {
  const [path] = useProp(undefined, { name: "path" });
  const [render] = useProp<undefined | (() => TemplateNode | TemplateNode[])>(
    undefined,
    { name: "render" }
  );
  const pattern = useMemo(
    () => (path ? new urlPattern.URLPattern(path, location.origin) : undefined),
    []
  );
  const currentLocation = useLocation();
  const active = useMemo(
    () => !!pattern?.test(currentLocation.href),
    [currentLocation]
  );
  return active ? render?.() : null;
});
