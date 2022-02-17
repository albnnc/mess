import {
  createCustomElement,
  html,
  useContext,
  useContextProvider,
  useState,
} from "../mod.ts";
import { createContext } from "../utils/mod.ts";

const context = createContext("number-context");

const ContextProvider = createCustomElement(() => {
  const [value, setValue] = useState(0);
  useContextProvider(context, value);
  return html`
    <p>
      <div>Provider:</div>
      <div>Context value = ${value}</div>
      <div>
        <button @click=${() => setValue((v) => v + 1)}>Increment</button>
      </div>
      <slot></slot>
    </p>
  `;
});

let renderCount = 0;

const ContextConsumer = createCustomElement(() => {
  const value = useContext(context);
  return html`
    <p>
      <div>Consumer:</div>
      <div>Render Count = ${++renderCount}</div>
      <div>Context Value = ${value}</div>
    </p>
  `;
});

const AppRoot = createCustomElement(() => {
  return html`
    <context-provider>
      <context-consumer></context-consumer>
    </context-provider>
  `;
});

customElements.define("context-provider", ContextProvider);
customElements.define("context-consumer", ContextConsumer);
customElements.define("app-root", AppRoot);
