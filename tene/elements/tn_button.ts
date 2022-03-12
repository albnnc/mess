import { createThemedElement, html, useProp } from "../deps.ts";

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
