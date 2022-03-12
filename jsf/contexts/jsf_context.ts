import { createContext } from "../deps.ts";
import { getControlElementName } from "../utils/mod.ts";

export const jsfContext = createContext("jsf", {
  getControlElementName,
});
