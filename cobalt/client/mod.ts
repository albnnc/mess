import { createCustomElement, html, defineCustomElements } from "./deps.ts";
import * as elements from "./elements/mod.ts";
import * as pages from "./pages/mod.ts";

defineCustomElements(elements);
defineCustomElements(pages);

const XRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <x-layout>
        <x-navbar />
        <x-layout-body>
          <x-layout-container>
            <x-route .path="/a" .render=${() => "A"} />
            <x-route .path="/login" .render=${() => html`<x-login-page />`} />
          </x-layout-container>
        </x-layout-body>
        <x-layout-footer>
          <x-layout-container>FOOTER</x-layout-container>
        </x-layout-footer>
      </x-layout>
    </tn-system>
  `;
});

customElements.define("x-root", XRoot);
