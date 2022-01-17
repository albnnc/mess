import { createCustomElement, html, useEffect, useState } from "../mod.ts";

let renderCount = 0;

const AppRoot = createCustomElement(() => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    setY(x + 1);
  }, [x]);
  return html`
    <button @click=${() => setX((v) => v + 1)}>Increment x</button>
    <p>x = ${x}</p>
    <p>y = x + 1 = ${y}</p>
    <p>Render Count = ${++renderCount}</p>
  `;
});

customElements.define("app-root", AppRoot);