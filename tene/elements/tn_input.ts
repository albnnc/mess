import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";

export const TnInput = createCustomElement(() => {
  const style = useThemeStyle();
  const [value, setValue] = useProp("", { name: "value" });
  const [placeholder] = useProp("", { name: "placeholder" });
  const [disabled] = useProp(false, { name: "disabled" });
  const [invalid] = useProp(false, { name: "invalid" });
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
