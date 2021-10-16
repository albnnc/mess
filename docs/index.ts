import { html, state, prop, HookCaller, defineCustomElement } from "../lib";

const render = ($: HookCaller) => {
  const [x, setX] = $(state)(5);
  // const [y, setY] = $(prop)(10, { name: "y" });
  // console.log("rendering with y =", y);
  // const memoized = $(memo)(() => x, [x % 2]);
  // $(effect)(() => {
  //   console.log("mounted");
  // }, []);
  // $(effect)(() => {
  //   console.log("x changed", x);
  // }, [x]);
  // console.log("memoized", memoized);

  // return html`<button
  //   name="foo"
  //   @click=${() => {
  //     setX((v) => v + 1);
  //     setX((v) => v + 1);
  //   }}
  // >
  //   Click ${x}
  // </button>`;

  return html`<div>
    <button
      name="foo"
      @click=${() => {
        setX((v) => v + 1);
        setX((v) => v + 1);
      }}
    >
      Click ${x}
    </button>
    <div>div</div>
  </div>`;
};

defineCustomElement(render, { tag: "co-button" });
