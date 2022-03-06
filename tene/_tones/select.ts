import { createCustomElement, html } from "../deps.ts";
import "../register.ts";

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
      <tn-select
        .placeholder="Select One"
        .options=${[
          { value: "1", title: "1" },
          { value: "2", title: "2" },
          { value: "3", title: () => JSON.stringify({ value: 1 }) },
        ]}
      />
      <tn-select .disabled .placeholder="Disabled" />
      <tn-select .invalid .placeholder="Invalid" />
    </div>
  `;
});

customElements.define("app-root", AppRoot);
