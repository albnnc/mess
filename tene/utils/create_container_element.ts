import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";

export interface ContainerElementOptions {
  style?: string;
}

export function createContainerElement({
  style,
}: ContainerElementOptions = {}) {
  return createCustomElement<{ kind?: string }>(() => {
    useProp<string | undefined>("kind", undefined);
    const themeStyle = useThemeStyle();
    return html`
      <style>
        ${themeStyle}
        ${style}
      </style>
      <slot />
    `;
  });
}
