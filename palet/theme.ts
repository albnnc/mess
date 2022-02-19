import { createContext, useContext, useElement } from "./deps.ts";

export type ElementTheme =
  | string
  | ((element: Element & Record<string, string>) => string); // FIXME
export type Theme = Record<string, ElementTheme>;

export const ThemeContext = createContext<Theme>("THEME");

export function useThemeStyle(tagName?: string) {
  const element = useElement();
  const targetTagName = tagName ?? element.tagName.toLocaleLowerCase();
  const theme = useContext(ThemeContext) ?? {};
  const elementTheme = theme[targetTagName];
  return elementTheme instanceof Function
    ? elementTheme(element as any) // FIXME
    : elementTheme;
}
