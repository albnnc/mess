import { createCustomElement, html } from "../deps.ts";
import "../define.ts";
import "../../tene/define.ts";

const ToneRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <jsf-select-field
        .schema=${{
          title: "Select",
          type: "string",
          oneOf: [{ const: "A" }, { const: "B" }],
        }}
      />
    </tn-system>
  `;
});

customElements.define("tone-root", ToneRoot);
