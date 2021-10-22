import { html, state, prop, HookCaller, defineCustomElement } from "../lib";

const render = ($: HookCaller) => {
  const [x, setX] = $(state)(0);
  console.log("render, x =", x);
  return html`<div>
    <button
      name="foo"
      @click=${() => {
        setX((v) => v + 1);
      }}
    >
      Click ${x}
    </button>
    ${x % 2 === 0 ? html`<div>div</div>` : ""}
  </div>`;
};

defineCustomElement(render, { tag: "co-button" });
