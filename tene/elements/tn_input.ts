import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";

export const TnInput = createCustomElement(() => {
  const style = useThemeStyle();
  const [value, setValue] = useProp("value", "");
  const [placeholder] = useProp("placeholder", "");
  const [disabled] = useProp("disabled", false);
  const [invalid] = useProp("invalid", false);
  return html`
    <style>
      ${style}
    </style>
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
