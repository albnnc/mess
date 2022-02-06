import { LIFECYCLE_HOOK_KEY } from "../constants.ts";
import { RenderableElement, TemplateNode } from "../types.ts";
import { ensureKey, updateNode } from "../utils/mod.ts";
import { useElement } from "./use_element.ts";

export const useLifecycle = () => {
  const element = useElement() as RenderableElement &
    Record<string | number | symbol, unknown>;
  return ensureKey(element, LIFECYCLE_HOOK_KEY, () => getData(element));
};

const getData = (element: RenderableElement) => {
  const data = {
    updating: false,
    update: () => {
      data.updating = false;
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
      updateNode(element.shadowRoot!, templateNode); // FIXME
      dispatchLocalEvent(element, "updated");
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
