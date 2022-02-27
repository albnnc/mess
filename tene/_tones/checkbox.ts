import { createCustomElement, html } from "../deps.ts";
import "../register.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <tn-system>
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
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
