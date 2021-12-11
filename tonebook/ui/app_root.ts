import { createCustomElement, useEffect, useState } from "../../cobalt/mod.ts";
import { styledHtml as html } from "../../cobalt_essentials/mod.ts";
import { TONEBOOK_TONE_DESCRIPTIONS } from "./tone_descriptions.ts";

export const AppRoot = createCustomElement(() => {
  const [currentToneDescription, setCurrentToneDescription] = useState(() => {
    const id = location.hash.replace("#", "");
    return (
      TONEBOOK_TONE_DESCRIPTIONS.find((v) => v.id === id) ??
      TONEBOOK_TONE_DESCRIPTIONS[0]
    );
  });
  useEffect(() => {
    const handleHashChange = () => {
      const nextId = location.hash.replace("#", "");
      const nextTone = TONEBOOK_TONE_DESCRIPTIONS.find((v) => v.id === nextId);
      if (!nextTone) {
        return;
      }
      setCurrentToneDescription(nextTone);
    };
    addEventListener("hashchange", handleHashChange);
    return () => {
      removeEventListener("hashchange", handleHashChange);
    };
  }, []);
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
