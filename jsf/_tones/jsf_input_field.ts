import { createCustomElement, html } from "../deps.ts";
import "../define.ts";
import "../../tene/define.ts";

const ToneRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <jsf-input-field
        .schema=${{ type: "integer", minimum: 0, maximum: 10 }}
      />
    </tn-system>
  `;
});

customElements.define("tone-root", ToneRoot);
