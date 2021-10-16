import htm from "htm";
import { TemplateNode } from "./types";

export interface Node {
  type: any;
  props: Record<string, any>;
  children: any[];
}

const h = (
  tag: string,
  options: Record<string, any>,
  ...children: TemplateNode[]
): TemplateNode => {
  const attributes: TemplateNode["attributes"] = {};
  const events: TemplateNode["events"] = {};
  const props: TemplateNode["props"] = {};
  Object.entries(options ?? {}).forEach(([key, value]) => {
    if (key.startsWith("@")) {
      events[key.slice(1)] = value;
    } else if (key.startsWith(".")) {
      props[key.slice(1)] = value;
    } else {
      attributes[key] = value;
    }
  });
  return {
    tag,
    attributes,
    events,
    props,
    children,
  };
};

export const html = htm.bind(h);
