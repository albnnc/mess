import { createCustomElement, html, useThemeStyle } from "./deps.ts";

export const TnInput = createCustomElement(() => {
  const style = useThemeStyle();
  return html`
    <style>
      ${style}
    </style>
    <input />
  `;
});

customElements.define("tn-input", TnInput);
