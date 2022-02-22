import { createCustomElement, html, useThemeStyle } from "../deps.ts";

export const TnDropMenu = createCustomElement(() => {
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
