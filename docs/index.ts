import { html, state, prop, memo, createCustomElement } from "../lib";

const AppButton = createCustomElement(($) => {
  const id = $(memo)(() => Math.random().toString().slice(-4), []);
  const [x, setX] = $(state)(0);
  const [y] = $(prop)(0, { name: "y" });
  return html`
    <button
      @click=${() => {
        setX((v) => v + 1);
      }}
    >
      Click id=${id} x=${x} y=${y}
    </button>
  `;
});

const AppRoot = createCustomElement(($) => {
  const [y, setY] = $(state)(1);
  return html`
    <div>
      <app-button
        .y=${y}
        @click=${() => {
          setY((v) => v + 1);
        }}
      />
      ${y % 2 ? html`<div>is odd</div>` : null}
    </div>
  `;
});

customElements.define("app-button", AppButton);
customElements.define("app-root", AppRoot);
