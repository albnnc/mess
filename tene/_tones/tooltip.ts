import { createCustomElement, html, useQuery } from "../deps.ts";
import { useTooltip } from "../mod.ts";
import "../register.ts";

const TooltipButton = createCustomElement(() => {
  const [tnButton] = useQuery("tn-button");
  useTooltip(() => "Description", { anchor: tnButton });
  return html`<tn-button .kind="primary">Hover Me</tn-button>`;
});

const AppRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <tooltip-button></tooltip-button>
    </tn-system>
  `;
});

customElements.define("tooltip-button", TooltipButton);
customElements.define("app-root", AppRoot);
