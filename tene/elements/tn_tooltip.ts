import {
  createCustomElement,
  floating,
  html,
  updateChildren,
  useContext,
  useElement,
  useEventListener,
  useMemo,
  useProp,
  useThemeStyle,
} from "../deps.ts";
import { systemContext } from "../mod.ts";
import { createContainerElement } from "../utils/mod.ts";

export const TnTooltipContent = createContainerElement();

export const TnTooltip = createCustomElement(() => {
  const element = useElement();
  const style = useThemeStyle();
  const anchor = useMemo(() => element.firstChild as HTMLElement, []); // FIXME
  const { portal } = useContext(systemContext) ?? {};
  const [content] = useProp("", { name: "content" });
  const [on] = useProp("mouseenter", { name: "on" });
  const [off] = useProp("mouseleave", { name: "off" });
  const instance = useMemo<{ current?: HTMLElement }>(() => ({}), []);
  useEventListener(
    on,
    () => {
      if (!portal || !anchor || instance.current) {
        return;
      }
      instance.current = document.createElement("tn-tooltip-content");
      updateChildren(instance.current, [content]);
      portal.appendChild(instance.current);
      const applyStyle = ({ x = 0, y = 0, strategy = "absolute" }) => {
        Object.assign(instance.current?.style ?? {}, {
          position: strategy,
          left: `${x}px`,
          top: `${y}px`,
        });
      };
      applyStyle({});
      floating.computePosition(anchor, instance.current).then(applyStyle);
    },
    [portal, content]
  );
  useEventListener(
    off,
    () => {
      if (!portal || !instance.current) {
        return;
      }
      portal.removeChild(instance.current);
      delete instance.current;
    },
    [portal, content]
  );
  return html`
    <style>
      ${style}
    </style>
    <slot></slot>
  `;
});
