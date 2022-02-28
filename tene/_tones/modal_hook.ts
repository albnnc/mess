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
          kind: "small",
          render: ({ close }) => html`
            <tn-modal-header>
              <tn-heading .kind="modal">Header</tn-heading>
            </tn-modal-header>
            <tn-modal-body>Content</tn-modal-body>
            <tn-modal-footer>
              <tn-button .kind="primary" @click=${close}>Close</tn-button>
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
  return html`
    <tn-system>
      <app-button></app-button>
    </tn-system>
  `;
});

customElements.define("app-button", AppButton);
customElements.define("app-root", AppRoot);
