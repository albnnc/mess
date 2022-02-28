import { createCustomElement, html } from "../deps.ts";
import { useModal } from "../mod.ts";
import "../register.ts";

const AppButton = createCustomElement(() => {
  const { openModal } = useModal();
  return html`
    <tn-button
      .kind="primary"
      @click=${() => {
        openModal({
          render: () => html`<tn-modal-body>Content</tn-modal-body>`,
        });
      }}
    >
      Open Modal
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
