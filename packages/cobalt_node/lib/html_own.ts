import { TemplateNode, TemplateNodeObject } from "./types";

const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_COMMENT = 4;
const MODE_PROP_SET = 5;
const MODE_PROP_APPEND = 6;

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

export const html = function (
  statics: TemplateStringsArray,
  ...values: any[]
): TemplateNodeObject | TemplateNodeObject[] {
  const fields = arguments;

  let mode = MODE_TEXT;
  let buffer = "";
  let quote = "";
  let current = [0] as any[];
  let char, propName;

  const commit = (field = undefined) => {
    if (
      mode === MODE_TEXT &&
      (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, "")))
    ) {
      current.push(field ? fields[field] : buffer);
    } else if (mode === MODE_TAGNAME && (field || buffer)) {
      current[1] = field ? fields[field] : buffer;
      mode = MODE_WHITESPACE;
    } else if (mode === MODE_WHITESPACE && buffer === "..." && field) {
      current[2] = Object.assign(current[2] || {}, fields[field]);
    } else if (mode === MODE_WHITESPACE && buffer && !field) {
      (current[2] = current[2] || {})[buffer] = true;
    } else if (mode >= MODE_PROP_SET) {
      if (mode === MODE_PROP_SET) {
        (current[2] = current[2] || {})[propName] = field
          ? buffer
            ? buffer + fields[field]
            : fields[field]
          : buffer;
        mode = MODE_PROP_APPEND;
      } else if (field || buffer) {
        current[2][propName] += field ? buffer + fields[field] : buffer;
      }
    }
    buffer = "";
  };

  for (let i = 0; i < statics.length; i++) {
    if (i) {
      if (mode === MODE_TEXT) {
        commit();
      }
      commit(i);
    }

    for (let j = 0; j < statics[i].length; j++) {
      char = statics[i][j];

      if (mode === MODE_TEXT) {
        if (char === "<") {
          // Commit buffer.
          commit();
          current = [current, "", null];
          mode = MODE_TAGNAME;
        } else {
          buffer += char;
        }
      } else if (mode === MODE_COMMENT) {
        // Ignore everything until the last
        // three characters are '-', '-' and '>'
        if (buffer === "--" && char === ">") {
          mode = MODE_TEXT;
          buffer = "";
        } else {
          buffer = char + buffer[0];
        }
      } else if (quote) {
        if (char === quote) {
          quote = "";
        } else {
          buffer += char;
        }
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === ">") {
        commit();
        mode = MODE_TEXT;
      } else if (!mode) {
        // Ignore everything until the tag ends.
      } else if (char === "=") {
        mode = MODE_PROP_SET;
        propName = buffer;
        buffer = "";
      } else if (
        char === "/" &&
        (mode < MODE_PROP_SET || statics[i][j + 1] === ">")
      ) {
        commit();
        if (mode === MODE_TAGNAME) {
          current = current[0];
        }
        // @ts-ignore
        mode = current;
        // @ts-ignore
        (current = current[0]).push(h(...mode.slice(1)));
        mode = MODE_SLASH;
      } else if (
        char === " " ||
        char === "\t" ||
        char === "\n" ||
        char === "\r"
      ) {
        // <a disabled>
        commit();
        mode = MODE_WHITESPACE;
      } else {
        buffer += char;
      }

      if (mode === MODE_TAGNAME && buffer === "!--") {
        mode = MODE_COMMENT;
        current = current[0];
      }
    }
  }

  commit();

  return current.length > 2 ? current.slice(1) : current[1];
};
