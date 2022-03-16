import { createThemedElement, html, useProp } from "../../deps.ts";

export const JsfErrorList = createThemedElement<{
  errors: string[];
}>(() => {
  const [errors] = useProp<undefined | string[]>("errors", undefined);
  if (!errors || errors.length < 1) {
    return undefined;
  }
  return errors.map((e) => html`<div key=${e}>${e}</div>`);
});
