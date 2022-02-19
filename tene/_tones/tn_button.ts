import {
  createCustomElement,
  html,
  ThemeContext,
  useContextProvider,
  useState,
} from "../deps.ts";
import { theme } from "../mod.ts";

const AppRoot = createCustomElement(() => {
  useContextProvider(ThemeContext, theme);
  const [x, setX] = useState(0);
  return html`
    <tn-system>
      <tn-button .kind="primary" @click=${() => setX((v) => v + 1)}>
        Increment ${x}
      </tn-button>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
