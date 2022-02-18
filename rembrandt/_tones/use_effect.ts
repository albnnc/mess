import { createCustomElement, html, useEffect, useState } from "../mod.ts";

let renderCount = 0;

const AppContent = createCustomElement(() => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    setY(x + 1);
  }, [x]);
  useEffect(() => {
    console.log("connected");
    return () => {
      console.log("disconnected");
    };
  }, []);
  return html`
    <button @click=${() => setX((v) => v + 1)}>Increment x</button>
    <p>x = ${x}</p>
    <p>y = x + 1 = ${y}</p>
    <p>Render Count = ${++renderCount}</p>
  `;
});

const AppRoot = createCustomElement(() => {
  const [shown, setShown] = useState(false);
  return html`
    <p><button @click=${() => setShown((v) => !v)}>Toggle Content</button></p>
    <p>${shown && html`<app-content></app-content>`}</p>
  `;
});

customElements.define("app-content", AppContent);
customElements.define("app-root", AppRoot);
