import { createCustomElement, html } from "../deps.ts";
import "../define.ts";
import "../../tene/define.ts";

const ToneRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <jsf-input-field .schema=${{ type: "unknown" }} />
    </tn-system>
  `;
});

customElements.define("tone-root", ToneRoot);
