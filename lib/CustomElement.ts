import { ELEMENT_KEY } from "./constants";
import { lifecycle } from "./hooks";
import { Hook, TemplateNode } from "./types";

export class CustomElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.use = this.use.bind(this);
    this.use[ELEMENT_KEY] = this;
    this.use(lifecycle).update();
  }

  use<T>(hook: Hook<T>): ReturnType<Hook<T>> {
    return hook(this.use);
  }

  render(): TemplateNode | TemplateNode[] {
    return null;
  }
}
