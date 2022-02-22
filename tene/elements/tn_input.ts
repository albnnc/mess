import { createCustomElement, html, useProp, useThemeStyle } from "../deps.ts";

export const TnInput = createCustomElement(() => {
  const style = useThemeStyle();
  const [value, setValue] = useProp("", { name: "value" });
  return html`
    <style>
      ${style}
    </style>
    <input
      .value=${value}
      @input=${(ev: InputEvent) => {
        const input = ev.currentTarget as HTMLInputElement;
        setValue(input.value ?? "");
      }}
    />
  `;
});

customElements.define("tn-input", TnInput);
