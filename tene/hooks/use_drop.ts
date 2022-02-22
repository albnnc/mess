import { systemContext } from "../contexts/mod.ts";
import {
  popper,
  TemplateNode,
  updateChildren,
  useContext,
  useMemoFn,
} from "../deps.ts";

export interface DropOptions {
  render: () => TemplateNode | TemplateNode[];
  kind?: string;
  placement?: popper.Placement;
}

export function useDrop() {
  const { portal } = useContext(systemContext) ?? {};
  return useMemoFn(
    (anchor: Element, { render, kind, ...rest }: DropOptions) => {
      if (!portal) {
        return;
      }
      const data = render();
      const drop = document.createElement("tn-drop");
      Object.assign(drop, { kind });
      updateChildren(drop, Array.isArray(data) ? data : [data]);
      portal.appendChild(drop);
      popper.createPopper(anchor, drop, rest);
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
