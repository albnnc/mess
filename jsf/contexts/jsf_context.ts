import { createContext } from "../deps.ts";
import { getControlElementTag } from "../utils/mod.ts";

export const jsfContext = createContext("jsf", {
  getControlElementTag,
});
