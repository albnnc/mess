import { createCustomElement, html, useState } from "../mod.ts";

const AppRoot = createCustomElement(() => {
  const [x, setX] = useState(0);
  return html`
    <button @click=${() => setX((v) => v + 1)}>Increment Once</button>
    <p>x = ${x}</p>
  `;
});

customElements.define("app-root", AppRoot);
