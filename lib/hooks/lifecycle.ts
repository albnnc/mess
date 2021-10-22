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
      console.log(templateNode);
      updateNode(el.shadowRoot, templateNode);
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
