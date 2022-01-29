import {
  createCustomElement,
  html,
  useContext,
  useContextProvider,
} from "../mod.ts";
import { createContext } from "../utils/mod.ts";

document.body.addEventListener("context-request", (ev) => {
  console.log("unregistered", ev);
});

const context = createContext("number-context", 0);

const AppButton = createCustomElement(() => {
  console.log("rendering button");
  const value = useContext(context);
  console.log("value", value);
  return html`<button>context value = ${value}</button>`;
});

const AppRoot = createCustomElement(() => {
  console.log("rendering root");
  useContextProvider(context, 1);
  return html`<app-button></app-button>`;
});

customElements.define("app-button", AppButton);
customElements.define("app-root", AppRoot);
