import { createCustomElement, html } from "../../cobalt/mod.ts";

const AppRoot = createCustomElement(() => {
  return html`
    <style>
      .container {
        width: 100vw;
        min-height: 100vh;
        color: rgb(200, 200, 200);
        background: rgb(20, 20, 20);
      }
    </style>
    <div class="container">SAMPLE</div>
  `;
});

customElements.define("app-root", AppRoot);
