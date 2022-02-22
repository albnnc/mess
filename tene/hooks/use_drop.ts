import { systemContext } from "../contexts/mod.ts";
import {
  floating,
  TemplateNode,
  updateChildren,
  useContext,
  useMemoFn,
} from "../deps.ts";

export interface DropOptions {
  render: () => TemplateNode | TemplateNode[];
  tailored?: boolean;
  placement?: floating.Placement;
}

export function useDrop() {
  const { portal } = useContext(systemContext) ?? {};
  return useMemoFn(
    (anchor: Element, { render, tailored, placement }: DropOptions) => {
      if (!portal) {
        return;
      }
      const data = render();
      const drop = document.createElement("tn-drop");
      updateChildren(drop, Array.isArray(data) ? data : [data]);
      portal.appendChild(drop);
      const applyStyle = ({ x = 0, y = 0, strategy = "absolute" }) => {
        Object.assign(drop.style, {
          position: strategy,
          left: `${x}px`,
          top: `${y}px`,
        });
        if (tailored) {
          const box = anchor.getBoundingClientRect();
          drop.style.width = `${box.width}px`;
        }
      };
      applyStyle({});
      floating.computePosition(anchor, drop, { placement }).then(applyStyle);
      const handleClick = (ev: MouseEvent) => {
        if (ev.composedPath().includes(drop)) {
          return;
        }
        portal.removeChild(drop);
        document.removeEventListener("click", handleClick);
      };
      // TODO: Consider removing RAF call here.
      // It is used now in order to ignore initiating event that
      // seems to be able to be catched via propagation.
      requestAnimationFrame(() => {
        document.addEventListener("click", handleClick);
      });
    },
    [portal]
  );
}
