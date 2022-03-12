import {
  createContext,
  createCustomElement,
  html,
  RenderFn,
  useContext,
  useElement,
  useProp,
} from "./deps.ts";

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

export function createThemedElement<P = Record<never, never>>(
  render: RenderFn
) {
  return createCustomElement<{ kind?: string } & P>(() => {
    useProp<string | undefined>("kind", undefined);
    const style = useThemeStyle();
    const template = render();
    return html`
      <style>
        ${style}
      </style>
      ${template}
    `;
  });
}
