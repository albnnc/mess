import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";
import { createContainerElement } from "../utils/mod.ts";

export const TnDrop = createContainerElement();

export const TnDropMenu = createContainerElement();

export const TnDropMenuItem = createCustomElement(() => {
  const style = useThemeStyle();
  useProp<unknown>("value", undefined);
  useProp<boolean>("active", false);
  const [disabled] = useProp<boolean>("disabled", false);
  return html`
    <style>
      ${style}
    </style>
    <button .disabled=${disabled}>
      <slot></slot>
    </button>
  `;
});
