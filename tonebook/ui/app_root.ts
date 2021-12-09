import { createCustomElement, useEffect, useState } from "../../cobalt/mod.ts";
import { styledHtml as html } from "../../cobalt_essentials/mod.ts";
import { TONEBOOK_TONES } from "./tones.ts";

export const AppRoot = createCustomElement(() => {
  const [currentTone, setCurrentTone] = useState(TONEBOOK_TONES[0]);
  useEffect(() => {
    const handleHashChange = () => {
      const nextId = location.hash.replace("#", "");
      const nextTone = TONEBOOK_TONES.find((v) => v.id === nextId);
      if (!nextTone) {
        return;
      }
      setCurrentTone(nextTone);
    };
    addEventListener("hashchange", handleHashChange);
    return () => {
      removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return html`
    <style>
      .container {
        width: 100vw;
        min-height: 100vh;
        color: rgb(200, 200, 200);
        background: rgb(30, 30, 30);
        display: flex;
        align-items: stretch;
        font-family: "Roboto", sans-serif;
      }
      iframe {
        flex: 1 1 auto;
        border: none;
      }
    </style>
    <div class="container">
      <app-menu></app-menu>
      ${currentTone &&
      html`<iframe src=${`tones/${currentTone.id}/`}></iframe>`}
    </div>
  `;
});

customElements.define("app-root", AppRoot);
