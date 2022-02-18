import { createContext, useContext } from "./deps.ts";

export const ThemeContext = createContext<Record<string, string>>("THEME");

export function useThemeStyle(key: string) {
  const theme = useContext(ThemeContext) ?? {};
  return theme[key];
}
