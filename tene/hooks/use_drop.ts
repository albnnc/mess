import { systemContext } from "../contexts/mod.ts";
import {
  floating,
  TemplateNode,
  updateChildren,
  useContext,
  useMemo,
  useMemoFn,
} from "../deps.ts";

export interface DropOptions {
  render: () => TemplateNode | TemplateNode[];
  tailored?: boolean;
  placement?: floating.Placement;
  onClose?: () => void;
}

export type DropDescription = readonly [HTMLElement, () => void];

export function useDrop() {
  const { portal } = useContext(systemContext) ?? {};
  const anchorDrops = useMemo(
    () => new WeakMap<Element, DropDescription>(),
    []
  );
  const openDrop = useMemoFn(
    (
      anchor: Element,
      { render, tailored, placement, onClose }: DropOptions
    ): DropDescription => {
      if (!portal) {
        throw new Error("Portal is undefined");
      }
      const existing = anchorDrops.get(anchor);
      if (existing) {
        return existing;
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
      const close = () => {
        portal.removeChild(drop);
        anchorDrops.delete(anchor);
        document.removeEventListener("click", handleClick);
        onClose?.();
      };
      const handleClick = (ev: MouseEvent) => {
        if (ev.composedPath().includes(drop)) {
          return;
        }
        close();
      };
      // TODO: Consider removing RAF call here.
      // It is used now in order to ignore initiating event that
      // seems to be able to be catched via propagation.
      requestAnimationFrame(() => {
        document.addEventListener("click", handleClick);
      });
      const description = [drop, close] as const;
      anchorDrops.set(anchor, description);
      return description;
    },
    [portal]
  );
  const openDropMenu = useMemoFn(
    <T>(anchor: Element, options: DropOptions) =>
      new Promise<T | undefined>((resolve) => {
        const [drop, close] = openDrop(anchor, {
          ...options,
          onClose: () => resolve(undefined),
        });
        drop.addEventListener("click", (ev: MouseEvent) => {
          const { value } = ev.target as Element & Record<string, unknown>; // FIXME
          resolve(value as T);
          close();
        });
      }),
    [openDrop]
  );
  return useMemo(() => ({ openDrop, openDropMenu }), [openDrop, openDropMenu]);
}
