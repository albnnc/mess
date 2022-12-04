import { createCustomElement, html } from "../deps.ts";
import "../define.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
      }
    </style>
    <div>
      <tn-input .value="With default value" />
      <tn-input .placeholder="Placeholder" />
      <tn-input .type="number" .placeholder=${`type="number"`} />
      <tn-input .disabled .value="Disabled" />
      <tn-input .invalid .value="Invalid" />
    </div>
  `;
});

customElements.define("app-root", AppRoot);