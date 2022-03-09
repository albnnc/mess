import {
  createCustomElement,
  Template,
  urlPattern,
  useMemo,
  useProp,
} from "../deps.ts";
import { useLocation } from "../hooks/mod.ts";

export const XRoute = createCustomElement(() => {
  const [path] = useProp("path", undefined);
  const [render] = useProp<undefined | (() => Template)>("render", undefined);
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
