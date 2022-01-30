import { claimElement, useLifecycle } from "./hooks/mod.ts";
import { RenderFn, TemplateNode } from "./types.ts";

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
    render() {
      let template: TemplateNode | TemplateNode[];
      claimElement(this, () => {
        template = fn();
      });
      return template!; // FIXME
    }
  };
};
