import { LIFECYCLE_DATA_KEY } from "../constants";
import { HookCaller } from "../types";
import { ensureKey } from "../utils";
import { CustomElement } from "../CustomElement";
import { element } from "./element";

export const lifecycle = ($: HookCaller) => {
  const el = $(element);
  return ensureKey(el, LIFECYCLE_DATA_KEY, () => getData(el));
};

const getData = (el: CustomElement) => {
  const data = {
    updating: false,
    update: () => {
      const content = el.render();
      el.shadowRoot.innerHTML = "";
      console.log(content);
      // here on should update shadowRoot
      // using edit distance definition
      // el.shadowRoot.appendChild(content);
    },
    requestUpdate: () => {
      if (data.updating) {
        return;
      }
      data.updating = true;
      requestAnimationFrame(() => {
        el.addEventListener(
          "update",
          () => {
            data.update();
            data.updating = false;
          },
          { once: true }
        );
        el.dispatchEvent(
          new CustomEvent("update", {
            bubbles: false,
            composed: false,
            cancelable: false,
          })
        );
      });
    },
  };
  return data;
};
