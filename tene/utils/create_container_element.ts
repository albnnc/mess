import { createCustomElement, html, useThemeStyle } from "../deps.ts";

export function createContainerElement(tag?: string) {
  return createCustomElement(() => {
    console.log("tag", tag);
    const style = useThemeStyle();
    return html`
      <style>
        ${style}
      </style>
      ${tag
        ? html`
          <${tag}>
            <slot></slot>
          </${tag}>
        `
        : html`<slot></slot>`}
    `;
  });
}
