import { createCustomElement, useMemo, useState } from "../../cobalt/mod.ts";
import { styledHtml as html } from "../../cobalt_essentials/mod.ts";
import { TONEBOOK_TONE_DESCRIPTIONS } from "./tone_descriptions.ts";
import { useCurrentToneDescription } from "./use_current_tone_description.ts";

export const AppMenu = createCustomElement(() => {
  const [query, setQuery] = useState("");
  const currentToneDescription = useCurrentToneDescription();
  const toneDescriptions = useMemo(
    () =>
      TONEBOOK_TONE_DESCRIPTIONS.sort((a, b) =>
        a.name.localeCompare(b.name)
      ).filter(
        (v) =>
          !query ||
          v.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      ),
    [query]
  );
  return html`
    <style>
      .container {
        color-scheme: dark;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 2rem;
        min-width: 200px;
        max-width: 250px;
        height: 100%;
        overflow-y: auto;
        background: rgb(30, 30, 30);
      }
      input {
        margin-bottom: 1rem;
        padding: 0;
        padding-bottom: 0.5rem;
        border: none;
        border-bottom: 1px solid rgb(255, 255, 255, 0.4);
        background: none;
        outline: none;
        font-size: 1rem;
        text-transform: uppercase;
        font-weight: 300;
        letter-spacing: 0.05em;
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
        &.current::before {
          content: "➝ ";
        }
      }
    </style>
    <div class="container">
      <input
        placeholder="Search"
        .value=${query}
        @input=${(e: Event) => setQuery((e.target as HTMLInputElement).value)}
      />
      ${toneDescriptions.map(
        (v) =>
          html`
            <a
              key=${v.id}
              href=${`#${v.id}`}
              class=${v.id === currentToneDescription.id ? "current" : ""}
            >
              ${v.name}
            </a>
          `
      )}
    </div>
  `;
});

customElements.define("app-menu", AppMenu);
