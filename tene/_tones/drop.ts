import { createCustomElement, html } from "../deps.ts";
import "../register.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <tn-drop>Lorem ipsum dolor sit amet</tn-drop>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);