import {
  NODE_TYPE_FRAGMENT,
  NODE_TYPE_ELEMENT,
  NODE_TYPE_TEXT,
} from "../constants";
import { TemplateNode } from "../types";
import { updateChildren } from "./updateChildren";

export const updateNode = (node: Node, templateNode: TemplateNode) => {
  // console.log("updateNode", node, node.nodeType, templateNode);
  if (
    (node.nodeType === NODE_TYPE_ELEMENT ||
      node.nodeType === NODE_TYPE_FRAGMENT) &&
    typeof templateNode === "object"
  ) {
    const { events, attributes, props, children } = templateNode;
    const el = node as Element;
    Object.entries(events).forEach(([k, v]) => {
      el.addEventListener(k, v);
    });
    Object.entries(attributes).forEach(([k, v]) => {
      if (el.getAttribute(k) !== v) {
        el.setAttribute(k, v);
      }
    });
    Object.entries(props).forEach(([k, v]) => {
      if (el[k] !== v) {
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
