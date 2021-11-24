import { createCustomElement, html } from "../../cobalt/mod.ts";

const AppRoot = createCustomElement(() => {
  return html`<div>SAMPLE</div>`;
});

customElements.define("app-root", AppRoot);
