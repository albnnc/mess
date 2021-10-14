import { HookCaller } from "../types";
import { element } from "./element";
import { ensureKey } from "../utils";
import { LIFECYCLE_DATA_KEY } from "../constants";
import { CustomElement } from "../CustomElement";

export const lifecycle = ($: HookCaller) => {
  const el = $(element);
  return ensureKey(el, LIFECYCLE_DATA_KEY, getDataInitializer(el));
};

const getDataInitializer = (el: CustomElement) => () => {
  const data = {
    updateIncoming: false,
    updateCallbacks: new Array<() => void | (() => void)>(0),
    update: () => {
      const cleanups = data.updateCallbacks.map((fn) => fn());
      data.updateCallbacks.splice(0, data.updateCallbacks.length);
      const content = el.render();
      el.shadowRoot.innerHTML = "";
      el.shadowRoot.appendChild(content);
      cleanups.forEach((fn) => fn && fn());
    },
    requestUpdate: () => {
      if (data.updateIncoming) {
        return;
      }
      data.updateIncoming = true;
      requestAnimationFrame(() => {
        data.update();
        data.updateIncoming = false;
      });
    },
    addUpdateCallback: (fn: () => void | (() => void)) =>
      data.updateCallbacks.push(fn),
  };
  return data;
};
