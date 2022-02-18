import { createCustomElement, html, useThemeStyle } from "./deps.ts";

export const TnButton = createCustomElement(() => {
  const style = useThemeStyle("button");
  return html`
    <style>
      ${style}
    </style>
    <button>
      <slot></slot>
    </button>
  `;
});

customElements.define("tn-button", TnButton);
