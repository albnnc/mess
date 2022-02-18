import {
  createCustomElement,
  html,
  ThemeContext,
  useContextProvider,
} from "../deps.ts";
import { theme } from "../mod.ts";

const AppRoot = createCustomElement(() => {
  useContextProvider(ThemeContext, theme);
  return html`
    <tn-button>Click</button>
  `;
});

customElements.define("app-root", AppRoot);
