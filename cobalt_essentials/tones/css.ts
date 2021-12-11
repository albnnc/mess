import { createCustomElement, html, useState } from "../deps.ts";
// import { styledHtml as html } from "../../cobalt_essentials/mod.ts";
import { useQuery } from "../hooks/mod.ts";

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
