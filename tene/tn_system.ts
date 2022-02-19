import { createCustomElement, html, useThemeStyle } from "./deps.ts";

export const TnSystem = createCustomElement(() => {
  const style = useThemeStyle();
  return html`
    <style>
      ${style}
    </style>
    <slot></slot>
  `;
});

customElements.define("tn-system", TnSystem);
