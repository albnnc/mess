import htm from "htm";

export interface Node {
  type: any;
  props: Record<string, any>;
  children: any[];
}

const h = (type: any, props: Record<string, any>, ...children: any[]) => {
  const tag = type === "object" ? type.tag : type;
  const element = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("@")) {
      const eventType = key.replace("@", "");
      element.addEventListener(eventType, value);
    } else {
      element[key] = value;
    }
  });

  children
    .map((v) => (typeof v !== "object" ? document.createTextNode(v) : v))
    .forEach((v) => element.appendChild(v));

  return element;
};

export const html = htm.bind(h);
