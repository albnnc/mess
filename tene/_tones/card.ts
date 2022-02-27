import { createCustomElement, html } from "../deps.ts";
import "../register.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <style>
      tn-card {
        min-width: 300px;
      }
    </style>
    <tn-system>
      <tn-card>
        <tn-card-header>Header</tn-card-header>
        <tn-card-body>Body</tn-card-body>
        <tn-card-footer>Footer</tn-card-footer>
      </tn-card>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
