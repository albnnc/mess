import { ELEMENT_KEY } from "../constants";
import { CustomElement } from "../CustomElement";
import { Hook } from "../types";

export const element: Hook<CustomElement> = ($) => $[ELEMENT_KEY];
