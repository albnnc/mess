import { createCustomElement, html, useQuery } from "../deps.ts";
import { useDrop } from "../mod.ts";
import "../register.ts";

const AppButton = createCustomElement(() => {
  const openDrop = useDrop();
  const [anchor] = useQuery("tn-button");
  return html`
    <tn-button
      .kind="primary"
      @click=${() => {
        openDrop(anchor, {
          render: () => html`
            <tn-drop-menu>
              <tn-drop-menu-item>1</tn-drop-menu-item>
              <tn-drop-menu-item>2</tn-drop-menu-item>
              <tn-drop-menu-item>3</tn-drop-menu-item>
              <tn-drop-menu-item>Lorem ipsum dolor sit amet</tn-drop-menu-item>
            </tn-drop-menu>
          `,
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
