import { ELEMENT_KEY } from "../constants";
import { HookCaller } from "../types";
import { CustomElement } from "../CustomElement";

export const element = ($: HookCaller) => $[ELEMENT_KEY] as CustomElement;
