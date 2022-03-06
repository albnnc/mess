import { createCustomElement, html } from "../deps.ts";
import "../register.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
      }
    </style>
    <div>
      <tn-button>Default</tn-button>
      <tn-button .kind="primary">Primary</tn-button>
      <tn-button .kind="secondary">Secondary</tn-button>
      <tn-button .kind="success">Success</tn-button>
      <tn-button .kind="warning">Warning</tn-button>
      <tn-button .kind="danger">Danger</tn-button>
    </div>
  `;
});

customElements.define("app-root", AppRoot);
