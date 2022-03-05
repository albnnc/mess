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
        <tn-input .value="With default value" />
        <tn-input .placeholder="Placeholder" />
        <tn-input .disabled .value="Disabled" />
        <tn-input .invalid .value="Invalid" />
      </div>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
