import { createCustomElement, html, prop, state } from "../lib";

export interface AppTableProps {
  columns: {
    key: string;
    heading: string;
  }[];
  data: object[];
}

const style = `
  table {
    color: #69cb78;
  }
  td, th {
    min-width: 150px;
    text-align: left;
  }
  td {
    cursor: pointer;
  }
`;

export const AppTable = createCustomElement(($) => {
  const [columns] = $(prop)([], { name: "columns" });
  const [data] = $(prop)([], { name: "data" });
  const [selections, setSelections] = $(state)([]);
  const r = html`
    <style>
      ${style}
    </style>
    <table>
      <thead>
        <tr>
          ${columns.map((v) => html`<th key=${v.key}>${v.heading}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${data.map(
          (datum) => html`
            <tr
              @click=${() =>
                setSelections((prior) =>
                  prior.includes(datum.id)
                    ? prior.filter((v) => v !== datum.id)
                    : prior.concat([datum.id])
                )}
            >
              ${columns.map(
                (v) => html`<td key=${v.key}>${datum[v.key] ?? "/"}</td>`
              )}
            </tr>
            ${selections.includes(datum.id) &&
            html`
              <!-- <tr key=${datum.id + "-expansion"}> -->
              <tr>
                <td colspan=${columns.length}>EXPANSION</td>
              </tr>
            `}
          `
        )}
      </tbody>
    </table>
  `;
  console.log(r);
  return r;
});
