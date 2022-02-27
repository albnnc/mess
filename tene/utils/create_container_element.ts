import { createCustomElement, html, useThemeStyle } from "../deps.ts";

export function createContainerElement(tag: string) {
  return createCustomElement(() => {
    const style = useThemeStyle();
    return html`
      <style>
        ${style}
      </style>
      <${tag}>
        <slot></slot>
      </${tag}>
    `;
  });
}
