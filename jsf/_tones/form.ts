import { createCustomElement, html } from "../deps.ts";
import { theme as systemTheme } from "../../tene/mod.ts";
import { theme as jsfTheme } from "../mod.ts";
import "../define.ts";
import "../../tene/define.ts";

const schema = {
  type: "object",
  properties: {
    username: {
      title: "Username",
      type: "string",
    },
    password: {
      title: "Password",
      type: "string",
      minLength: 8,
    },
  },
};

const theme = {
  ...systemTheme,
  ...jsfTheme,
};

const ToneRoot = createCustomElement(() => {
  return html`
    <tn-system .theme=${theme}>
      <jsf-form .schema=${schema} />
    </tn-system>
  `;
});

customElements.define("tone-root", ToneRoot);
