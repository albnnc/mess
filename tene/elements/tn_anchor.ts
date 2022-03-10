import {
  createCustomElement,
  html,
  useElement,
  useMemoFn,
  useProp,
  useThemeStyle,
} from "../deps.ts";

export const TnAnchor = createCustomElement<{
  push?: boolean;
  replace?: boolean;
  href?: string;
}>(() => {
  const element = useElement();
  const style = useThemeStyle();
  const [push] = useProp("push", false);
  const [replace] = useProp("replace", false);
  const [href] = useProp<string | undefined>("href", undefined);
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
    <style>
      ${style}
    </style>
    <a ...${href ? { href } : {}} @click=${handleClick}>
      <slot />
    </a>
  `;
});
