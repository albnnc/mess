import { createCustomElement, html, useProp, useState } from "../lib";

export interface AppTableProps {
  columns: {
    key: string;
    heading: string;
  }[];
  data: object[];
}

export const AppTable = createCustomElement(() => {
  const [columns] = useProp([], { name: "columns" });
  const [data] = useProp([], { name: "data" });
  const [selections, setSelections] = useState([]);
  const t = html`
    <table part="table">
      <thead part="head">
        <tr>
          ${columns.map((v) => html`<th key=${v.key}>${v.heading}</th>`)}
        </tr>
      </thead>
      <tbody part="body">
        ${data.map(
          (datum) => html`
            <tr
              key=${datum.id}
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
              <tr key=${datum.id + "-expansion"}>
                <!-- <tr> -->
                <td colspan=${columns.length}>EXPANSION</td>
              </tr>
            `}
          `
        )}
      </tbody>
    </table>
  `;
  console.log("template", t);
  return t;
});