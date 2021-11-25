import { createCustomElement, html, useState } from "../deps.ts";
import { css } from "../mod.ts";

const AppRoot = createCustomElement(() => {
  const [count, setCount] = useState(0);
  return html`
    <style>
      ${css`
        .container {
          width: 100vw;
          min-height: 100vh;
          background: rgb(20, 20, 20);
          color: ${count % 2 ? "red" : "rgb(200, 200, 200)"};
        }
      `}
    </style>
    <div class="container">
      <button @click=${() => setCount((v) => v + 1)}>Increment</button>
      <div>is odd: ${count % 2 ? "yes" : "no"}</div>
    </div>
  `;
});

customElements.define("app-root", AppRoot);
