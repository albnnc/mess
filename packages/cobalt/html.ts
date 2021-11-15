import { htm } from "./deps.ts";
import { TemplateNodeObject, TemplateNode } from "./types.ts";

const h = (
  tag: string,
  options: Record<string, unknown>,
  ...children: TemplateNode[]
): TemplateNode => {
  const attributes: TemplateNodeObject["attributes"] = {};
  const events: TemplateNodeObject["events"] = {};
  const props: TemplateNodeObject["props"] = {};
  Object.entries(options ?? {}).forEach(([key, value]) => {
    if (key.startsWith("@")) {
      events[key.slice(1)] = value as (e: Event) => void; // FIXME
    } else if (key.startsWith(".")) {
      props[key.slice(1)] = value;
    } else {
      attributes[key] = value as string; // FIXME
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
