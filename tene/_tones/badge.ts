import { createCustomElement, html } from "../deps.ts";
import "../define.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: var(--space-s);
      }
    </style>
    <div>
      <tn-badge .kind="primary">Primary</tn-badge>
      <tn-badge .kind="secondary">Secondary</tn-badge>
      <tn-badge .kind="success">Success</tn-badge>
      <tn-badge .kind="warning">Warning</tn-badge>
      <tn-badge .kind="danger">Danger</tn-badge>
    </div>
  `;
});

customElements.define("app-root", AppRoot);
