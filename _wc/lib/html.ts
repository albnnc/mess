import htm from "htm/mini";
import { TemplateNodeObject } from ".";
import { TemplateNode } from "./types";

const h = (
  tag: string,
  options: Record<string, any>,
  ...children: TemplateNode[]
): TemplateNode => {
  const attributes: TemplateNodeObject["attributes"] = {};
  const events: TemplateNodeObject["events"] = {};
  const props: TemplateNodeObject["props"] = {};
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
    children: children.flat(Infinity),
  };
};

export const html = htm.bind(h);
