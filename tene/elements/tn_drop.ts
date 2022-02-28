import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";
import { createContainerElement } from "../utils/mod.ts";

export const TnDrop = createContainerElement();

export const TnDropMenu = createContainerElement();

export const TnDropMenuItem = createCustomElement(() => {
  const style = useThemeStyle();
  useProp<unknown>(undefined, { name: "value" });
  useProp<boolean>(false, { name: "active" });
  const [disabled] = useProp<boolean>(false, { name: "disabled" });
  return html`
    <style>
      ${style}
    </style>
    <button .disabled=${disabled}>
      <slot></slot>
    </button>
  `;
});
