import { createCustomElement, html } from "../deps.ts";
import "../mod.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <style>
        div {
          display: flex;
          flex-direction: column;
          gap: var(--space-s);
        }
      </style>
      <div>
        <tn-input .value="With default value"></tn-input>
        <tn-input .placeholder="Placeholder"></tn-input>
      </div>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
