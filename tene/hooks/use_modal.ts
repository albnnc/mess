import { systemContext } from "../contexts/mod.ts";
import {
  TemplateNode,
  updateChildren,
  useContext,
  useMemo,
  useMemoFn,
} from "../deps.ts";

export interface ModalOptions {
  render: () => TemplateNode | TemplateNode[];
  onClose?: () => void;
}

export type ModalDescription = readonly [HTMLElement, () => void];

export function useModal() {
  const { portal } = useContext(systemContext) ?? {};
  const openModal = useMemoFn(
    ({ render, onClose }: ModalOptions): ModalDescription => {
      if (!portal) {
        throw new Error("Portal is undefined");
      }
      const data = render();
      const modal = document.createElement("tn-modal");
      updateChildren(modal, Array.isArray(data) ? data : [data]);
      portal.appendChild(modal);
      const backdrop = modal.shadowRoot?.querySelector(
        `[part="backdrop"]`
      ) as HTMLElement;
      const close = () => {
        portal.removeChild(modal);
        backdrop.removeEventListener("click", close);
        onClose?.();
      };
      backdrop.addEventListener("click", close);
      return [modal, close] as const;
    },
    [portal]
  );
  return useMemo(() => ({ openModal }), [openModal]);
}
