import { createCustomElement, html, useQuery } from "../deps.ts";
import { useTooltip } from "../mod.ts";
import "../define.ts";

const TooltipButton = createCustomElement(() => {
  const [tnButton] = useQuery("tn-button");
  useTooltip(() => "Description", { anchor: tnButton });
  return html`<tn-button .kind="primary">Hover Me</tn-button>`;
});

const AppRoot = createCustomElement(() => {
  return html`
    <tn-card>
      <tn-card-body>
        <tooltip-button></tooltip-button>
      </tn-card-body>
    </tn-card>
  `;
});

customElements.define("tooltip-button", TooltipButton);
customElements.define("app-root", AppRoot);
