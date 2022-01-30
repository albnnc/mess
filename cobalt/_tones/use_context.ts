import {
  createCustomElement,
  html,
  useContext,
  useContextProvider,
} from "../mod.ts";
import { createContext } from "../utils/mod.ts";

const context = createContext("number-context", 0);

const ContextProvider = createCustomElement(() => {
  useContextProvider(context, 1);
  return html`<slot></slot>`;
});

const ContextConsumer = createCustomElement(() => {
  const value = useContext(context);
  return html`context value = ${value}`;
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
