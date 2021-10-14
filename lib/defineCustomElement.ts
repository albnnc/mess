import { RenderFn, DefineOptions } from "./types";
import { CustomElement } from "./CustomElement";

export const defineCustomElement = (
  render: RenderFn,
  { tag }: DefineOptions
) => {
  class TargetElement extends CustomElement {
    render() {
      return render.call(this, this.use);
    }
  }
  customElements.define(tag, TargetElement);
};
