import { createCustomElement, html } from "./deps.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <tn-button .kind="primary">Primary</tn-button>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
