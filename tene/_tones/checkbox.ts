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
      <tn-checkbox>Lorem ipsum</tn-checkbox>
      <tn-checkbox .checked>Checked</tn-checkbox>
      <tn-checkbox .disabled>Disabled</tn-checkbox>
      <tn-checkbox .invalid>Invalid</tn-checkbox>
    </div>
  `;
});

customElements.define("app-root", AppRoot);
