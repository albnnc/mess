import { RenderFn, DefineOptions } from "./types";
import { CustomElement } from "./CustomElement";

export const defineCustomElement = (fn: RenderFn, { tag }: DefineOptions) => {
  class TargetElement extends CustomElement {
    render() {
      return fn(this.use);
    }
  }
  customElements.define(tag, TargetElement);
};
