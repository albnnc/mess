import { createCustomElement, html } from "../deps.ts";
import "../define.ts";
import "../../tene/define.ts";
import { useFormManager } from "../hooks/mod.ts";

const ToneRoot = createCustomElement(() => {
  const manager = useFormManager({
    schema: {
      type: "object",
      properties: {
        username: {
          title: "Username",
          type: "string",
        },
        password: {
          title: "Password",
          type: "string",
        },
      },
    },
  });
  return html`
    <tn-system>
      <jsf-form .manager=${manager} />
    </tn-system>
  `;
});

customElements.define("tone-root", ToneRoot);
