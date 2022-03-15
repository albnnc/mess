import { createCustomElement, html } from "../deps.ts";

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

const ToneRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <jsf-form .schema=${schema} />
    </tn-system>
  `;
});

customElements.define("tone-root", ToneRoot);
