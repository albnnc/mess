import { html, useProp } from "../deps.ts";
import { createThemedElement } from "../utils/mod.ts";

export const TnButton = createThemedElement<{
  disabled?: boolean;
}>(() => {
  const [disabled] = useProp("disabled", false);
  return html`
    <button .disabled=${disabled}>
      <slot />
    </button>
  `;
});
