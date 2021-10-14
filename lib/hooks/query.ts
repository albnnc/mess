import { HookCaller } from "..";
import { element } from "./element";

export const query = ($: HookCaller) => (selector: string) => {
  const e = $(element);
  return e.querySelector(selector) as HTMLElement | null;
};
