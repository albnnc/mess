import { systemContext } from "../contexts/mod.ts";
import {
  floating,
  TemplateNode,
  updateChildren,
  useContext,
  useEffect,
  useMemo,
} from "../deps.ts";

export interface TooltipOptions {
  anchor?: Element;
  triggers?: [string, string];
  offset?: number;
  placement?: floating.Placement;
}

export function useTooltip(
  render: () => TemplateNode | TemplateNode[],
  {
    anchor,
    triggers = ["mouseenter", "mouseleave"],
    offset = 10,
    placement,
  }: TooltipOptions
) {
  const content = useMemo(() => render(), [render]);
  const state = useMemo(() => ({ open: false }), []);
  const { portal } = useContext(systemContext) ?? {};
  useEffect(() => {
    if (!anchor || !content || !portal) {
      return;
    }
    let tooltip: undefined | HTMLElement;
    let cleanup: undefined | (() => void);
    const handleOpen = () => {
      if (state.open) {
        return;
      }
      state.open = true;
      tooltip = document.createElement("tn-tooltip");
      updateChildren(tooltip, Array.isArray(content) ? content : [content]);
      portal.appendChild(tooltip);
      const applyStyle = ({ x = 0, y = 0, strategy = "absolute" }) => {
        Object.assign(tooltip?.style ?? {}, {
          position: strategy,
          left: `${x}px`,
          top: `${y}px`,
        });
      };
      applyStyle({});
      const update = () =>
        tooltip &&
        floating
          .computePosition(anchor, tooltip, {
            placement,
            middleware: [
              floating.autoPlacement(),
              floating.shift(),
              floating.offset(offset),
            ],
          })
          .then(applyStyle);
      update();
      cleanup = floating.autoUpdate(anchor, tooltip, update);
    };
    const handleClose = () => {
      state.open = false;
      tooltip && portal.removeChild(tooltip);
      cleanup?.();
    };
    anchor.addEventListener(triggers[0], handleOpen);
    anchor.addEventListener(triggers[1], handleClose);
    return () => {
      anchor.removeEventListener(triggers[0], handleOpen);
      anchor.removeEventListener(triggers[1], handleClose);
    };
  }, [anchor, content, portal]);
}
