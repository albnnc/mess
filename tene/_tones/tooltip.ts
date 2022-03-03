import { createCustomElement, html } from "../deps.ts";
import "../register.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <tn-tooltip .content="Description">
        <tn-button .kind="primary">Hover Me</tn-button>
      </tn-tooltip>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
