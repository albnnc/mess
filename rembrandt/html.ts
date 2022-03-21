import { htm } from "./deps.ts";
import { Template, TemplateNodeObject } from "./types.ts";

const h = (
  tag: string,
  options: Record<string, unknown>,
  ...children: Template[]
): Template => {
  const attributes: TemplateNodeObject["attributes"] = {};
  const events: TemplateNodeObject["events"] = {};
  const props: TemplateNodeObject["props"] = {};
  Object.entries(options ?? {}).forEach(([key, value]) => {
    if (key.startsWith("@") && value instanceof Function) {
      events[key.slice(1)] = value as (e: Event) => void;
    } else if (key.startsWith(".")) {
      props[key.slice(1)] = value;
    } else if (typeof value === "string" || value === undefined) {
      attributes[key] = value;
    }
  });
  return { tag, attributes, events, props, children };
};

export const html = htm.bind(h) as (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Template;
