import { createContext, useContext, useElement } from "./deps.ts";

export type ElementTheme =
  | string
  | ((element: Element & Record<string, string>) => string); // FIXME
export type Theme = Record<string, ElementTheme>;

export const themeContext = createContext<Theme>("THEME");

export function useThemeStyle(tagName?: string) {
  const element = useElement();
  const targetTagName = tagName ?? element.tagName.toLocaleLowerCase();
  const { [targetTagName]: elementTheme } = useContext(themeContext) ?? {};
  return elementTheme instanceof Function
    ? // deno-lint-ignore no-explicit-any
      elementTheme(element as any) // FIXME
    : elementTheme;
}
