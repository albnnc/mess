import { html, TemplateNode } from "../deps.ts";
import { css } from "./css.ts";

export function styledHtml(...args: Parameters<typeof html>) {
  const template = html(...args);
  const nodes = Array.isArray(template) ? template : [template];
  const walk = (nodes: TemplateNode[]) => {
    for (const node of nodes) {
      if (!node || typeof node !== "object") {
        continue;
      }
      if (node.tag === "style") {
        console.log("assigning");
        node.children = [
          css`
            ${node.children.join("")}
          `,
        ];
      } else {
        walk(node.children);
      }
    }
  };
  walk(nodes);
  return template;
}
