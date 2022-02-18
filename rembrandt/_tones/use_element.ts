import { createCustomElement, html, useElement } from "../mod.ts";

const AppRoot = createCustomElement(() => {
  const element = useElement();
  console.log(element);
  return html`<p>root element is logged to console</p>`;
});

customElements.define("app-root", AppRoot);
