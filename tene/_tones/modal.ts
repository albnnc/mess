import { createCustomElement, html } from "../deps.ts";
import { useModal } from "../mod.ts";
import "../define.ts";

const AppButton = createCustomElement(() => {
  const { openModal } = useModal();
  return html`
    <tn-button
      .kind="primary"
      @click=${() => {
        openModal({
          kind: "small",
          render: ({ close }) => html`
            <tn-modal-header>
              <tn-heading .kind="modal">Header</tn-heading>
            </tn-modal-header>
            <tn-modal-body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </tn-modal-body>
            <tn-modal-footer .kind="actions">
              <tn-button .kind="secondary" @click=${close}>Cancel</tn-button>
              <tn-button .kind="primary" @click=${close}>Save</tn-button>
            </tn-modal-footer>
          `,
        });
      }}
    >
      Open Modal
    </tn-button>
  `;
});

const AppRoot = createCustomElement(() => {
  return html`<app-button />`;
});

customElements.define("app-button", AppButton);
customElements.define("app-root", AppRoot);
