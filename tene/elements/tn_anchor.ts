import {
  createCustomElement,
  html,
  useMemoFn,
  useProp,
  useThemeStyle,
} from "../deps.ts";

export const TnAnchor = createCustomElement(() => {
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
