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
      <style>
        div {
          display: flex;
          flex-direction: column;
          gap: var(--space-s);
        }
      </style>
      <div>
        <tn-input .value="With default value"></tn-input>
        <tn-input .placeholder="Placeholder"></tn-input>
      </div>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
