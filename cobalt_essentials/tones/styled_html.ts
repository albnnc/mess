import { createCustomElement, useMemo, useState } from "../deps.ts";
import { useQuery } from "../hooks/mod.ts";
import { styledHtml as html } from "../mod.ts";

const AppRoot = createCustomElement(() => {
  const [count, setCount] = useState(0);
  const [styleElement] = useQuery("style");
  return html`
    <style>
      button {
        color: ${count % 2 ? "red" : "blue"};
      }
      code {
        display: block;
        max-width: 300px;
        overflow: auto;
      }
    </style>
    <button @click=${() => setCount((v) => v + 1)}>Increment</button>
    <code>${styleElement?.innerHTML}</code>
  `;
});

customElements.define("app-root", AppRoot);

const AppButton = createCustomElement(() => {
  const id = useMemo(() => Math.random().toString().slice(-4), []);
  return html`<button>Increment id=${id}</button>`;
});

customElements.define("app-button", AppButton);
