import { html, useProp } from "../deps.ts";
import { createContainerElement, createThemedElement } from "../utils/mod.ts";

export const TnDrop = createContainerElement();

export const TnDropMenu = createContainerElement();

export const TnDropMenuItem = createThemedElement<{
  value?: unknown;
  active?: boolean;
  disabled?: boolean;
}>(() => {
  useProp<unknown>("value", undefined);
  useProp<boolean>("active", false);
  const [disabled] = useProp<boolean>("disabled", false);
  return html`
    <button .disabled=${disabled}>
      <slot />
    </button>
  `;
});
