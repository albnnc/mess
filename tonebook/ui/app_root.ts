import { createCustomElement } from "../../cobalt/mod.ts";
import { styledHtml as html } from "../../cobalt_essentials/mod.ts";
import { useCurrentToneDescription } from "./use_current_tone_description.ts";

export const AppRoot = createCustomElement(() => {
  const currentToneDescription = useCurrentToneDescription();
  return html`
    <style>
      .container {
        display: flex;
        align-items: stretch;
        width: 100vw;
        height: 100vh;
        color: rgb(200, 200, 200);
        background: rgb(20, 20, 20);
        font-family: "Roboto", sans-serif;
      }
      iframe {
        flex: 1 1 auto;
        border: none;
      }
    </style>
    <div class="container">
      <app-menu></app-menu>
      ${currentToneDescription &&
      html`<iframe src=${`tones/${currentToneDescription.id}/`}></iframe>`}
    </div>
  `;
});

customElements.define("app-root", AppRoot);
