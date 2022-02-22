import { createCustomElement, html, useThemeStyle } from "../deps.ts";

export const TnDropMenuItem = createCustomElement(() => {
  const style = useThemeStyle();
  return html`
    <style>
      ${style}
    </style>
    <div>
      <slot></slot>
    </div>
  `;
});
