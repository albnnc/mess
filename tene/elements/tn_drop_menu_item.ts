import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";

export const TnDropMenuItem = createCustomElement(() => {
  const style = useThemeStyle();
  useProp<unknown>(undefined, { name: "value" });
  useProp<boolean>(false, { name: "active" });
  return html`
    <style>
      ${style}
    </style>
    <button>
      <slot></slot>
    </button>
  `;
});
