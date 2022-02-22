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
    <tn-system>
      <tn-drop>Lorem ipsum dolor sit amet</tn-drop>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
