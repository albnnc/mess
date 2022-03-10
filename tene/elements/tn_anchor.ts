import { html, useElement, useMemoFn, useProp } from "../deps.ts";
import { createThemedElement } from "../utils/mod.ts";

export const TnAnchor = createThemedElement<{
  push?: boolean;
  replace?: boolean;
  href?: string;
}>(() => {
  const [push] = useProp("push", false);
  const [replace] = useProp("replace", false);
  const [href] = useProp<string | undefined>("href", undefined);
  const element = useElement();
  const handleClick = useMemoFn((ev: PointerEvent) => {
    if (!push && !replace) {
      return;
    }
    ev.preventDefault();
    push && history.pushState("", "", href);
    replace && history.replaceState("", "", href);
    // TODO: Consider better handling of state changing.
    element.dispatchEvent(
      new CustomEvent(push ? "pushstate" : "replacestate", {
        bubbles: true,
        composed: true,
      })
    );
  }, []);
  return html`
    <a ...${href ? { href } : {}} @click=${handleClick}>
      <slot />
    </a>
  `;
});
