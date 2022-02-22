import { createContext } from "../deps.ts";

export interface SystemContextValue {
  portal?: Element;
}

export const systemContext = createContext<SystemContextValue>("SYSTEM");
