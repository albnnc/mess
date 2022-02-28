import { createCustomElement, html, useThemeStyle } from "../deps.ts";
import { createContainerElement } from "../utils/mod.ts";

export const TnModal = createCustomElement(() => {
  const style = useThemeStyle();
  return html`
    <style>
      ${style}
    </style>
    <div part="backdrop"></div>
    <div part="content">
      <slot></slot>
    </div>
  `;
});

export const TnModalHeader = createContainerElement();

export const TnModalBody = createContainerElement();

export const TnModalFooter = createContainerElement();
