import { createCustomElement, html } from "../deps.ts";
import "../register.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <style>
      :host {
        width: 100vw;
        height: 100vh;
      }
    </style>
    <tn-system>
      <tn-modal .kind="small">
        <tn-modal-header>
          <tn-heading .kind="modal">Header</tn-heading>
        </tn-modal-header>
        <tn-modal-body>Body</tn-modal-body>
        <tn-modal-footer>Footer</tn-modal-footer>
      </tn-modal>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
