import { HookCaller } from "..";
import { element } from "./element";

export const query = ($: HookCaller) => (selector: string) => {
  const el = $(element);
  return el.querySelector(selector) as HTMLElement | null;
};
