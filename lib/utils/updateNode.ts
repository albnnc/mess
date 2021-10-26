import { ensureKey } from ".";
import { EVENT_LISTENERS_KEY } from "..";
import {
  NODE_TYPE_FRAGMENT,
  NODE_TYPE_ELEMENT,
  NODE_TYPE_TEXT,
} from "../constants";
import { TemplateNode } from "../types";
import { updateChildren } from "./updateChildren";

export const updateNode = (node: Node, templateNode: TemplateNode) => {
  const shouldLog =
    typeof templateNode === "object" && templateNode.tag === "app-button";
  // shouldLog && console.log("[updateNode]", node, templateNode);
  if (
    (node.nodeType === NODE_TYPE_ELEMENT ||
      node.nodeType === NODE_TYPE_FRAGMENT) &&
    typeof templateNode === "object"
  ) {
    const { events, attributes, props, children } = templateNode;
    const el = node as Element;
    // shouldLog && console.log("el", el);
    const eventListeners = ensureKey(
      el,
      EVENT_LISTENERS_KEY,
      () => new Map<string, EventListenerOrEventListenerObject>()
    );
    Object.entries(events).forEach(([k, v]) => {
      if (eventListeners.has(k)) {
        el.removeEventListener(k, eventListeners.get(k));
      }
      el.addEventListener(k, v);
      eventListeners.set(k, v);
    });
    Object.entries(attributes).forEach(([k, v]) => {
      if (el.getAttribute(k) !== v) {
        el.setAttribute(k, v);
      }
    });
    Object.entries(props).forEach(([k, v]) => {
      if (el[k] !== v) {
        // shouldLog &&
        //   console.log("[updateNode] set prop", k, "from", el[k], "to", v);
        el[k] = v;
      }
    });
    updateChildren(node, children);
  } else if (
    node.nodeType === NODE_TYPE_TEXT &&
    (typeof templateNode === "string" || typeof templateNode === "number")
  ) {
    const data = templateNode.toString();
    const text = node as Text;
    text.replaceWith(data);
  }
};
