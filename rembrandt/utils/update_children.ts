import { NODE_TYPE_TEXT, NODE_TYPE_ELEMENT } from "../constants.ts";
import { TemplateNode } from "../types.ts";
import { updateNode } from "./update_node.ts";

export const updateChildren = (parent: Node, templateNodes: TemplateNode[]) => {
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
    if (
      templateNode === null ||
      templateNode === undefined ||
      typeof templateNode === "boolean"
    ) {
      continue;
    }
    const token = getTemplateNodeToken(templateNode, templateNodeCounts);
    tokenTemplateNodeMap.set(token, templateNode);
    templateNodeTokenMap.set(templateNode, token);
  }
  node = parent.firstChild;
  for (const templateNode of templateNodes) {
    if (
      templateNode === null ||
      templateNode === undefined ||
      typeof templateNode === "boolean"
    ) {
      continue;
    }
    if (node) {
      const nodeToken = nodeTokenMap.get(node)!; // FIXME
      const templateNodeToken = templateNodeTokenMap.get(templateNode)!; // FIXME
      if (nodeToken === templateNodeToken) {
        // Since current tokens are equal, we can
        // just update current node and continue looping.
        updateNode(node, templateNode);
        node = node.nextSibling;
        continue;
      } else {
        const isExisting = tokenNodeMap.has(templateNodeToken);
        const nodeToInsert = isExisting
          ? tokenNodeMap.get(templateNodeToken)! // FIXME
          : initializeTemplateNode(templateNode);
        parent.insertBefore(nodeToInsert, node);
        if (isExisting) {
          updateNode(nodeToInsert, templateNode);
        }
        if (!tokenTemplateNodeMap.has(nodeToken)) {
          parent.removeChild(node);
          node = nodeToInsert.nextSibling;
        }
        continue;
      }
    } else {
      // Since we're here, we've already reached the last parent element,
      // so the only thing we can do with new template nodes is just to create
      // a new DOM node.
      const initializedNode = initializeTemplateNode(templateNode);
      parent.appendChild(initializedNode);
    }
  }
  while (node) {
    const next = node.nextSibling;
    parent.removeChild(node);
    node = next;
  }
};

const initializeTemplateNode = (templateNode: TemplateNode) => {
  if (templateNode && typeof templateNode === "object") {
    const node = document.createElement(templateNode.tag);
    updateNode(node, templateNode);
    return node;
  }
  return document.createTextNode(templateNode?.toString() ?? "");
};

const indexToken = (token: string, counts: Record<string, number>) => {
  const index = counts[token] ?? (counts[token] = 0);
  return token + "-" + index;
};

const getNodeToken = (node: Node, counts: Record<string, number>) => {
  if (node.nodeType === NODE_TYPE_ELEMENT) {
    const element = node as Element;
    const key = element.getAttribute("key");
    return indexToken(
      element.tagName.toLocaleLowerCase() + (key ? "-" + key : ""),
      counts
    );
  } else if (node.nodeType === NODE_TYPE_TEXT) {
    return "text-" + node.nodeValue;
  }
  return "unknown-type-" + node.nodeType.toString();
};

const getTemplateNodeToken = (
  templateNode: TemplateNode,
  counts: Record<string, number>
) => {
  if (templateNode && typeof templateNode === "object") {
    const {
      tag,
      attributes: { key },
    } = templateNode;
    return indexToken(tag + (key ? "-" + key : ""), counts);
  }
  return templateNode !== undefined && templateNode !== null
    ? "text-" + templateNode.toString()
    : "";
};
