import { systemContext } from "../contexts/mod.ts";
import {
  TemplateNode,
  updateChildren,
  useContext,
  useMemo,
  useMemoFn,
} from "../deps.ts";

export interface ModalRendererOptions {
  close: () => void;
}

export interface ModalOptions {
  render: (options: ModalRendererOptions) => TemplateNode | TemplateNode[];
  kind?: string;
  onClose?: () => void;
}

export type ModalDescription = readonly [HTMLElement, () => void];

export function useModal() {
  const { portal } = useContext(systemContext) ?? {};
  const openModal = useMemoFn(
    ({ render, kind, onClose }: ModalOptions): ModalDescription => {
      if (!portal) {
        throw new Error("Portal is undefined");
      }
      const close = () => {
        portal.removeChild(modal);
        backdrop.removeEventListener("click", close);
        onClose?.();
      };
      const data = render({ close });
      const modal = document.createElement("tn-modal");
      Object.assign(modal, { kind });
      updateChildren(modal, Array.isArray(data) ? data : [data]);
      portal.appendChild(modal);
      const backdrop = modal.shadowRoot?.querySelector(
        `[part="backdrop"]`
      ) as HTMLElement;
      backdrop.addEventListener("click", close);
      return [modal, close] as const;
    },
    [portal]
  );
  return useMemo(() => ({ openModal }), [openModal]);
}
