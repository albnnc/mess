import { createCustomElement } from "../../cobalt/mod.ts";
import { styledHtml as html } from "../../cobalt_essentials/mod.ts";
import { getSheets } from "./get_sheets.ts";

const sheets = getSheets();

export const AppMenu = createCustomElement(() => {
  console.log("sheets", sheets);
  return html`
    <style>
      .container {
        padding: 1.5rem;
        max-width: 300px;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      a {
        text-transform: uppercase;
        font-weight: 300;
        letter-spacing: 0.05em;
        &,
        &:visited,
        &:focus {
          color: inherit;
          text-decoration: none;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    </style>
    <div class="container">
      ${sheets.map(
        (v) => html`
          <div key=${v.id}>
            <a href=${`#${v.id}`}>${v.name}</a>
          </div>
        `
      )}
    </div>
  `;
});

customElements.define("app-menu", AppMenu);
