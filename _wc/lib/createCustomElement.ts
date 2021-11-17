import { claimElement, useLifecycle } from "./hooks";
import { RenderFn } from "./types";

export const createCustomElement = (fn: RenderFn) => {
  return class CustomElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      claimElement(this, () => {
        useLifecycle().update();
      });
    }
    render() {
      let template;
      claimElement(this, () => {
        template = fn();
      });
      return template;
    }
  };
};
