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

export const TnModalHeader = createContainerElement("div");

export const TnModalBody = createContainerElement("div");

export const TnModalFooter = createContainerElement("div");
