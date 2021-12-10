import { createCustomElement, useMemo, useState } from "../deps.ts";
import { styledHtml as html } from "../mod.ts";

const AppRoot = createCustomElement(() => {
  const [count, setCount] = useState(0);
  return html`
    <style>
      button {
        color: ${count % 2 ? "red" : "blue"};
      }
    </style>
    <button @click=${() => setCount((v) => v + 1)}>Increment</button>
  `;
});

customElements.define("app-root", AppRoot);

const AppButton = createCustomElement(() => {
  const id = useMemo(() => Math.random().toString().slice(-4), []);
  return html`<button>Increment id=${id}</button>`;
});

customElements.define("app-button", AppButton);
