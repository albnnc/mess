import { createCustomElement, html } from "../deps.ts";
import "../define.ts";
import "../../tene/define.ts";

const ToneRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <jsf-object-field
        .schema=${{
          title: "Object",
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
          if: {
            type: "object",
            properties: {
              username: { const: "admin" },
            },
            required: ["username"],
          },
          then: {
            type: "object",
            properties: {
              secretPassword: {
                title: "Secret Password",
                type: "string",
              },
            },
          },
        }}
      />
    </tn-system>
  `;
});

customElements.define("tone-root", ToneRoot);
