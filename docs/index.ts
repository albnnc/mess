import {
  html,
  state,
  HookCaller,
  defineCustomElement,
  prop,
  memo,
  effect,
} from "../lib";

defineCustomElement(
  ($) => {
    const id = $(memo)(() => Math.random().toString().slice(-4), []);
    const [x, setX] = $(state)(0);
    const [y] = $(prop)(0, { name: "y" });
    // console.log("[app-button] render, x =", x, ", y =", y);
    return html`<button
      name="foo"
      @click=${() => {
        setX((v) => v + 1);
      }}
    >
      Click id=${id} x=${x} y=${y}
    </button>`;
  },
  { tag: "app-button" }
);

defineCustomElement(
  ($) => {
    const [y, setY] = $(state)(1);
    // console.log("[app-root] render, y =", y);
    return html`<div>
      <app-button
        .y=${y}
        @click=${() => {
          // console.log("[app-root] app-button click");
          setY((v) => v + 1);
        }}
      ></app-button>
      ${y % 2 ? html`<div>is odd</div>` : null}
    </div>`;
  },
  { tag: "app-root" }
);

// defineCustomElement(
//   ($) => {
//     const [x, setX] = $(state)(1);
//     // $(effect)(() => {
//     //   console.log("x changed:", x);
//     // }, [x]);
//     return html`<div>
//       <button
//         @click=${() => {
//           console.log("@click");
//           setX((v) => v + 1);
//         }}
//       >
//         Click ${x}
//       </button>
//     </div>`;
//   },
//   { tag: "app-root" }
// );
