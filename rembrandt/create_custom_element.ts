import { claimElement, useLifecycle } from "./hooks/mod.ts";
import { RenderFn, Template } from "./types.ts";
import { dispatchLocalEvent } from "./utils/mod.ts";

export const createCustomElement = (fn: RenderFn) => {
  return class CustomElement extends HTMLElement {
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
  };
};
