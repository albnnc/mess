import { createCustomElement, html, registerElements } from "./deps.ts";
import * as elements from "./elements/mod.ts";

registerElements(elements);

const XRoot = createCustomElement(() => {
  return html`
    <tn-system>
      <x-layout>
        <x-navbar />
        <x-layout-body>
          <x-layout-container>
            <x-route .path="/a">A</x-route>
            <x-route .path="/b">B</x-route>
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
