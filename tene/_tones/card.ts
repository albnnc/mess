import { createCustomElement, html } from "../deps.ts";
import "../define.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <style>
      tn-card {
        min-width: 300px;
      }
    </style>
    <tn-card>
      <tn-card-header>
        <tn-heading .kind="card">Header</tn-heading>
      </tn-card-header>
      <tn-card-body>Body</tn-card-body>
      <tn-card-footer>Footer</tn-card-footer>
    </tn-card>
  `;
});

customElements.define("app-root", AppRoot);
