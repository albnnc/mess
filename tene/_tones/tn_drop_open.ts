import { createCustomElement, html, useQuery } from "../deps.ts";
import { useDrop } from "../mod.ts";

const AppButton = createCustomElement(() => {
  const openDrop = useDrop();
  const [anchor] = useQuery("tn-button");
  return html`
    <tn-button
      .kind="primary"
      @click=${() => {
        openDrop(anchor, {
          render: () => html`Lorem ipsum`,
          tailored: true,
        });
      }}
    >
      Open Drop
    </tn-button>
  `;
});

const AppRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <app-button></app-button>
    </tn-system>
  `;
});

customElements.define("app-button", AppButton);
customElements.define("app-root", AppRoot);
