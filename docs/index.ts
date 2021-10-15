import { html, defineCustomElement, RenderFn, state, effect } from "../lib";

const render: RenderFn = ($) => {
  const [x, setX] = $(state)(5);
  // $(effect)(() => {
  //   console.log("mounted");
  // }, []);
  return html`<button
    name="foo"
    @click=${() => {
      setX((v) => v + 1);
      setX((v) => v + 1);
    }}
  >
    Click ${x}
  </button>`;
};

defineCustomElement(render, { tag: "co-button" });
