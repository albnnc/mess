import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";

export const TnDropMenuItem = createCustomElement(() => {
  const style = useThemeStyle();
  useProp<unknown>(undefined, { name: "value" });
  return html`
    <style>
      ${style}
    </style>
    <button>
      <slot></slot>
    </button>
  `;
});
