import { html, useState, useProp, useMemo, createCustomElement } from "../lib";
import { AppTable } from "./table";

const AppButton = createCustomElement(() => {
  const id = useMemo(() => Math.random().toString().slice(-4), []);
  const [x, setX] = useState(0);
  const [y] = useProp(0, { name: "y" });
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

// const AppRoot = createCustomElement(() => {
//   const [y, setY] = useState(1);
//   return html`
//     <div>
//       <app-button
//         .y=${y}
//         @click=${() => {
//           setY((v) => v + 1);
//         }}
//       />
//       ${y % 2 ? html`<div>is odd</div>` : null}
//     </div>
//   `;
// });

const data = [
  { id: "1", name: "Ann", age: 25 },
  { id: "2", name: "Joe", age: 18 },
  { id: "3", name: "Alex", age: 23 },
  { id: "4", name: "Jack", age: 30 },
];

const columns = [
  { key: "id", heading: "#" },
  { key: "name", heading: "Name" },
  { key: "age", heading: "Age" },
];

const style = `
  app-table::part(table) {
    color: #83d795;
  }
`;

const AppRoot = createCustomElement(() => {
  return html`
    <style>
      ${style}
    </style>
    <div>
      <app-table .columns=${columns} .data=${data}></app-table>
    </div>
  `;
});

// const AppRoot = createCustomElement(() => {
//   const [x, setX] = useState(0);
//   return html`
//     <div
//       @click=${() => {
//         setX((v) => v + 1);
//       }}
//     >
//       SAMPLE ${x}
//     </div>
//   `;
// });

// const AppRoot = createCustomElement(($) => {
//   const x = $(memo)(() => Math.random().toString().slice(-4), []);
//   const [y, setY] = $(state)(1);
//   return html`
//     <button @click=${() => setY((v) => v + 1)}>x=${x} y=${y}</button>
//   `;
// });

customElements.define("app-table", AppTable);
customElements.define("app-button", AppButton);
customElements.define("app-root", AppRoot);
