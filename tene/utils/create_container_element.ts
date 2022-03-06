import { createCustomElement, html, useThemeStyle } from "../deps.ts";

export interface ContainerElementOptions {
  style?: string;
}

export function createContainerElement({
  style,
}: ContainerElementOptions = {}) {
  return createCustomElement(() => {
    const themeStyle = useThemeStyle();
    return html`
      <style>
        ${themeStyle}
        ${style}
      </style>
      <slot></slot>
    `;
  });
}
