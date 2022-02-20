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
        <tn-button .kind="primary">Primary</tn-button>
        <tn-button .kind="secondary">Secondary</tn-button>
        <tn-button .kind="success">Success</tn-button>
        <tn-button .kind="warning">Warning</tn-button>
        <tn-button .kind="danger">Danger</tn-button>
      </div>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
