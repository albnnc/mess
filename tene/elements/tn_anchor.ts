import {
  createCustomElement,
  html,
  useElement,
  useMemoFn,
  useProp,
  useThemeStyle,
} from "../deps.ts";

export const TnAnchor = createCustomElement(() => {
  const element = useElement();
  const style = useThemeStyle();
  const [push] = useProp(false, { name: "push" });
  const [replace] = useProp(false, { name: "replace" });
  const [href] = useProp(undefined, { name: "href" });
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
