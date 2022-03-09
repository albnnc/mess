import { claimElement, useLifecycle } from "../hooks/mod.ts";
import { CustomElement, RenderFn, Template } from "../types.ts";
import { dispatchLocalEvent } from "./dispatch_local_event.ts";

export function createCustomElement<P = Record<never, never>>(fn: RenderFn) {
  return class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      claimElement(this, () => {
        useLifecycle().update();
      });
    }
    disconnectedCallback() {
      dispatchLocalEvent(this, "disconnected");
    }
    renderShadowContent() {
      let template: Template;
      claimElement(this, () => (template = fn()));
      return template;
    }
  } as { new (): CustomElement<P> };
}
