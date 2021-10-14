import { CustomElement } from "../CustomElement";
import { ELEMENT_KEY } from "../constants";
import { Hook } from "../types";

export const element: Hook<CustomElement> = ($) => $[ELEMENT_KEY];
