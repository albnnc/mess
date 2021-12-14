import { createCustomElement, html, useState } from "../mod.ts";

let renderCount = 0;

const AppRoot = createCustomElement(() => {
  const [x, setX] = useState(0);
  return html`
    <button
      @click=${() => {
        setX((v) => v + 1);
        setX((v) => v + 1);
      }}
    >
      Increment Twice
    </button>
    <p>x = ${x}</p>
    <p>Render Count = ${++renderCount}</p>
  `;
});

customElements.define("app-root", AppRoot);
