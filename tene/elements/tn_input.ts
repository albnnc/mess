import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";

export const TnInput = createCustomElement(() => {
  const style = useThemeStyle();
  const [value, setValue] = useProp("", { name: "value" });
  const [placeholder] = useProp("", { name: "placeholder" });
  return html`
    <style>
      ${style}
    </style>
    <input
      .value=${value}
      .placeholder=${placeholder}
      @input=${(ev: InputEvent) => {
        const input = ev.currentTarget as HTMLInputElement;
        setValue(input.value ?? "");
      }}
    />
  `;
});
