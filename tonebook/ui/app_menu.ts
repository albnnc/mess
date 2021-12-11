import { createCustomElement, useMemo } from "../../cobalt/mod.ts";
import { styledHtml as html } from "../../cobalt_essentials/mod.ts";
import { TONEBOOK_TONE_DESCRIPTIONS } from "./tone_descriptions.ts";

export const AppMenu = createCustomElement(() => {
  const toneDescriptions = useMemo(
    () =>
      TONEBOOK_TONE_DESCRIPTIONS.sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  return html`
    <style>
      .container {
        color-scheme: dark;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.5rem 2rem;
        min-width: 200px;
        max-width: 250px;
        height: 100%;
        overflow-y: auto;
        background: rgb(30, 30, 30);
      }
      a {
        display: block;
        text-transform: uppercase;
        font-weight: 300;
        letter-spacing: 0.05em;
        overflow: hidden;
        flex: 0 0 auto;
        white-space: nowrap;
        text-overflow: ellipsis;
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
      ${toneDescriptions.map(
        (v) => html`<a key=${v.id} href=${`#${v.id}`}>${v.name}</a>`
      )}
    </div>
  `;
});

customElements.define("app-menu", AppMenu);
