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
        <tn-card-header>
          <tn-heading .kind="card">Card w/ List</tn-heading>
        </tn-card-header>
        <tn-card-body .kind="list">
          <tn-list>
            <tn-list-item>1</tn-list-item>
            <tn-list-item>2</tn-list-item>
            <tn-list-item .kind="pair">
              <span>3</span>
              <tn-badge .kind="secondary">Pair Value</tn-badge>
            </tn-list-item>
            <tn-list-item>4</tn-list-item>
          </tn-list>
        </tn-card-body>
      </tn-card>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
