import { createCustomElement, html, registerElements } from "./deps.ts";
import * as elements from "./elements/mod.ts";

registerElements(elements);

const AppRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <app-layout>
        <app-layout-header>
          <app-layout-container>HEADER</app-layout-container>
        </app-layout-header>
        <app-layout-body>
          <app-layout-container>BODY</app-layout-container>
        </app-layout-body>
        <app-layout-footer>
          <app-layout-container>FOOTER</app-layout-container>
        </app-layout-footer>
      </app-layout>
    </tn-system>
  `;
});

customElements.define("app-root", AppRoot);
