import { createCustomElement, html as basicHtml, useState } from "../deps.ts";
import { useQuery } from "../hooks/mod.ts";
import { styledHtml } from "../utils/mod.ts";

const AppRoot = createCustomElement(() => {
  const [withStyled, setWithStyled] = useState(true);
  const [styleElement] = useQuery("style");
  const html = withStyled ? styledHtml : basicHtml;
  return html`
    <style>
      div {
        margin: 1rem 0;
      }
      code {
        display: block;
        width: 300px;
        max-width: 100%;
        white-space: pre-wrap;
      }
    </style>
    <input
      id="with-styled"
      type="checkbox"
      .checked=${withStyled}
      @change=${(e: InputEvent) => {
        setWithStyled((e.target as HTMLInputElement).checked);
      }}
    />
    <label for="with-styled">use styled html</label>
    <div>app-root style, taken by useQuery hook:</div>
    <code>${styleElement?.innerHTML}</code>
  `;
});

customElements.define("app-root", AppRoot);
