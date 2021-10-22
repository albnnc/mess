import { NODE_TYPE_ELEMENT } from "../constants";
import { TemplateNode } from "../types";
import { updateNode } from "./updateNode";

export const updateChildren = (parent: Node, templateNodes: TemplateNode[]) => {
  // console.log("updateChildren", parent, templateNodes);
  const nodeCounts = {};
  const tokenNodeMap = new Map<string, Node>();
  const nodeTokenMap = new Map<Node, string>();
  let node = parent.firstChild;
  while (node) {
    const token = getNodeToken(node, nodeCounts);
    tokenNodeMap.set(token, node);
    nodeTokenMap.set(node, token);
    node = node.nextSibling;
  }

  const templateNodeCounts = {};
  const tokenTemplateNodeMap = new Map<string, TemplateNode>();
  const templateNodeTokenMap = new Map<TemplateNode, string>();
  for (const templateNode of templateNodes) {
    const token = getTemplateNodeToken(templateNode, templateNodeCounts);
    tokenTemplateNodeMap.set(token, templateNode);
    templateNodeTokenMap.set(templateNode, token);
  }

  node = parent.firstChild;
  for (const templateNode of templateNodes) {
    if (node) {
      const nodeToken = nodeTokenMap.get(node);
      const templateNodeToken = templateNodeTokenMap.get(templateNode);
      if (nodeToken === templateNodeToken) {
        // Since current tokens are equal,
        // we can just update it and continue looping.
        updateNode(node, templateNode);
        node = node.nextSibling;
        continue;
      } else {
        if (tokenNodeMap.has(templateNodeToken)) {
          const targetNode = tokenNodeMap.get(templateNodeToken);
          node.nextSibling
            ? parent.insertBefore(targetNode, node.nextSibling)
            : parent.appendChild(targetNode);
          node = node.nextSibling;
          continue;
        } else {
          const next = node.nextSibling;
          const initializedNode = initializeTemplateNode(templateNode);
          next
            ? parent.insertBefore(initializedNode, next)
            : parent.appendChild(initializedNode);
          if (!tokenTemplateNodeMap.has(nodeToken)) {
            parent.removeChild(node);
          }
          node = next;
          continue;
        }
      }
    } else {
      // Since we're here, we've already reached the last parent element,
      // so the only thing we can do with new template nodes is just to create
      // a new DOM node.
      const initializedNode = initializeTemplateNode(templateNode);
      parent.appendChild(initializedNode);
    }
  }
};

const initializeTemplateNode = (templateNode: TemplateNode) => {
  if (typeof templateNode === "object") {
    const node = document.createElement(templateNode.tag);
    updateNode(node, templateNode);
    return node;
  } else {
    return document.createTextNode(templateNode.toString());
  }
};

const indexToken = (token: string, counts: Record<string, number>) => {
  const index = counts[token] ?? (counts[token] = 0);
  return token + "-" + index;
};

const getNodeToken = (node: Node, counts: Record<string, number>) => {
  if (node.nodeType === NODE_TYPE_ELEMENT) {
    const element = node as Element;
    const key = element.getAttribute("key");
    return indexToken(element.tagName + (key ? "-" + key : ""), counts);
  }
  return "non-element-type-" + node.nodeType.toString();
};

const getTemplateNodeToken = (
  templateNode: TemplateNode,
  counts: Record<string, number>
) => {
  if (typeof templateNode === "object") {
    const {
      tag,
      attributes: { key },
    } = templateNode;
    return indexToken(tag + "-" + (key ? "-" + key : ""), counts);
  }
  return templateNode.toString();
};
