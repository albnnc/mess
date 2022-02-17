import { createCustomElement, useState } from "../deps.ts";
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
    <button @click=${() => setCount((v) => v + 1)}>Toggle</button>
    <code>${styleElement?.innerHTML}</code>
  `;
});

customElements.define("app-root", AppRoot);
