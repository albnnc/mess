import { html, useProp } from "../deps.ts";
import { createThemedElement } from "../utils/mod.ts";

export const TnInput = createThemedElement<{
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
}>(() => {
  const [value, setValue] = useProp("value", "");
  const [placeholder] = useProp("placeholder", "");
  const [disabled] = useProp("disabled", false);
  const [invalid] = useProp("invalid", false);
  return html`
    <input
      class=${invalid ? "invalid" : undefined}
      .value=${value}
      .placeholder=${placeholder}
      .disabled=${disabled}
      @input=${(ev: InputEvent) => {
        const input = ev.currentTarget as HTMLInputElement;
        setValue(input.value ?? "");
      }}
    />
  `;
});
