import { createCustomElement, html, useState } from "../deps.ts";

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
