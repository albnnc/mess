import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";

export const TnButton = createCustomElement(() => {
  const style = useThemeStyle();
  const [disabled] = useProp("disabled", false);
  return html`
    <style>
      ${style}
    </style>
    <button .disabled=${disabled}>
      <slot />
    </button>
  `;
});
