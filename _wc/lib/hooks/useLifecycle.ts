import { LIFECYCLE_DATA_KEY } from "../constants";
import { RenderableElement, TemplateNode } from "../types";
import { ensureKey, updateNode } from "../utils";
import { useElement } from "./useElement";

export const useLifecycle = () => {
  const element = useElement();
  return ensureKey(element, LIFECYCLE_DATA_KEY, () => getData(element));
};

const getData = (element: RenderableElement) => {
  const data = {
    updating: false,
    update: () => {
      console.log(element);
      const templateOutput = element.render();
      const templateNode: TemplateNode = {
        tag: "",
        events: {},
        attributes: {},
        props: {},
        children: Array.isArray(templateOutput)
          ? templateOutput
          : [templateOutput],
      };
      updateNode(element.shadowRoot, templateNode);
      dispatchLocalEvent(element, "updated");
      data.updating = false;
    },
    requestUpdate: () => {
      if (data.updating) {
        return;
      }
      data.updating = true;
      requestAnimationFrame(() => {
        element.addEventListener("update", data.update, { once: true });
        dispatchLocalEvent(element, "update");
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
