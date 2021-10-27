import { RenderFn } from "./types";
import { CustomElement } from "./CustomElement";

export const createCustomElement = (fn: RenderFn) => {
  return class extends CustomElement {
    render() {
      return fn(this.use);
    }
  };
};
