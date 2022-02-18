import {
  createCustomElement,
  html,
  useQuery,
  useState,
} from "../../rembrandt/mod.ts";
import { css } from "../mod.ts";

const style = (view: { color: string }) => css`
  button {
    color: ${view.color};
  }
  code {
    display: block;
    max-width: 300px;
    overflow: auto;
  }
`;

const AppRoot = createCustomElement(() => {
  const [count, setCount] = useState(0);
  const [styleElement] = useQuery("style");
  return html`
    <style>
      ${style({ color: count % 2 ? "blue" : "red" })}
    </style>
    <button @click=${() => setCount((v) => v + 1)}>Toggle</button>
    <code>${styleElement?.innerHTML}</code>
  `;
});

customElements.define("app-root", AppRoot);
