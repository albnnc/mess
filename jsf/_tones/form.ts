import { createCustomElement, html } from "../deps.ts";
import "../define.ts";
import "../../tene/define.ts";
import { useFormManager } from "../hooks/mod.ts";

const ToneRoot = createCustomElement(() => {
  const manager = useFormManager({
    schema: {
      title: "Input",
      type: "string",
    },
  });
  return html`
    <tn-system>
      <jsf-form .manager=${manager} />
    </tn-system>
  `;
});

customElements.define("tone-root", ToneRoot);
