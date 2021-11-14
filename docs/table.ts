import { createCustomElement, html, prop, state } from "../lib";

export interface AppTableProps {
  columns: {
    key: string;
    heading: string;
  }[];
  data: object[];
}

export const AppTable = createCustomElement(($) => {
  const [columns] = $(prop)([], { name: "columns" });
  const [data] = $(prop)([], { name: "data" });
  const [selections, setSelections] = $(state)([]);
  return html`
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
});
