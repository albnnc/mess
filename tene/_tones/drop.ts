import { createCustomElement, html, useQuery, useState } from "../deps.ts";
import { useDrop } from "../mod.ts";
import "../define.ts";

const AppButton = createCustomElement(() => {
  const { openDropMenu } = useDrop();
  const [value, setValue] = useState<number | undefined>(undefined);
  const [anchor] = useQuery("tn-button");
  return html`
    <tn-button
      .kind="primary"
      @click=${() => {
        openDropMenu<number>(anchor, {
          render: () => html`
            <tn-drop-menu>
              <tn-drop-menu-item .value=${1}>1</tn-drop-menu-item>
              <tn-drop-menu-item .value=${2}>2</tn-drop-menu-item>
              <tn-drop-menu-item .value=${3}>3</tn-drop-menu-item>
              <tn-drop-menu-item .value=${4}>
                Lorem ipsum dolor sit amet
              </tn-drop-menu-item>
            </tn-drop-menu>
          `,
          tailored: true,
        })
          .then(setValue)
          .catch(() => undefined);
      }}
    >
      ${value ? `Value is ${value}` : "Open Drop"}
    </tn-button>
  `;
});

const AppRoot = createCustomElement(() => {
  return html` <app-button /> `;
});

customElements.define("app-button", AppButton);
customElements.define("app-root", AppRoot);
