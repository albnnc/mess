import { ELEMENT_KEY } from "./constants";
import { Hook } from "./types";

export class CustomElement extends HTMLElement {
  #updateCallbacks = new Array<() => void | (() => void)>(0);
  #hasUpdateIncoming = false;

  constructor() {
    super();
    this.use = this.use.bind(this);
    this.use[ELEMENT_KEY] = this;
    this.attachShadow({ mode: "open" });
    this.update();
  }

  use<T>(hook: Hook<T>): ReturnType<Hook<T>> {
    return hook(this.use);
  }

  render(): HTMLElement | null {
    return null;
  }

  update() {
    console.log("--> updating");
    const cleanups = this.#updateCallbacks.map((fn) => fn());
    this.#updateCallbacks.splice(0, this.#updateCallbacks.length);
    const content = this.render();
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(content);
    cleanups.forEach((fn) => fn && fn());
  }

  requestUpdate(fn: () => void | (() => void)) {
    this.#updateCallbacks.push(fn);
    if (this.#hasUpdateIncoming) {
      return;
    }
    this.#hasUpdateIncoming = true;
    requestAnimationFrame(() => {
      this.update();
      this.#hasUpdateIncoming = false;
    });
  }
}
