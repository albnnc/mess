import { LIFECYCLE_DATA_KEY } from "../constants";
import { HookCaller, TemplateNode } from "../types";
import { ensureKey, updateNode } from "../utils";
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
      const templateOutput = el.render();
      const templateNode: TemplateNode = {
        tag: "",
        events: {},
        attributes: {},
        props: {},
        children: Array.isArray(templateOutput)
          ? templateOutput
          : [templateOutput],
      };
      updateNode(el.shadowRoot, templateNode);
      dispatchLocalEvent(el, "updated");
      data.updating = false;
    },
    requestUpdate: () => {
      if (data.updating) {
        return;
      }
      data.updating = true;
      requestAnimationFrame(() => {
        el.addEventListener("update", data.update, { once: true });
        dispatchLocalEvent(el, "update");
      });
    },
  };
  return data;
};

const dispatchLocalEvent = (el: HTMLElement, event: string) => {
  el.dispatchEvent(
    new CustomEvent(event, {
      bubbles: false,
      composed: false,
      cancelable: false,
    })
  );
};
