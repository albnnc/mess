import { createCustomElement, html, useThemeStyle } from "../deps.ts";

export function createContainerElement() {
  return createCustomElement(() => {
    const style = useThemeStyle();
    return html`
      <style>
        ${style}
      </style>
      <slot></slot>
    `;
  });
}
