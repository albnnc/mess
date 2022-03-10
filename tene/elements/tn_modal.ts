import { html } from "../deps.ts";
import { createContainerElement, createThemedElement } from "../utils/mod.ts";

export const TnModal = createThemedElement(() => {
  return html`
    <div part="backdrop"></div>
    <div part="content">
      <slot />
    </div>
  `;
});

export const TnModalHeader = createContainerElement();

export const TnModalBody = createContainerElement();

export const TnModalFooter = createContainerElement();
