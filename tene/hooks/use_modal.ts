import { systemContext } from "../contexts/mod.ts";
import {
  Template,
  updateChildren,
  useContext,
  useMemo,
  useMemoFn,
} from "../deps.ts";

export interface ModalRendererOptions {
  close: () => void;
}

export interface ModalOptions {
  render: (options: ModalRendererOptions) => Template;
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
      const modal = document.createElement("tn-modal");
      const content = render({ close });
      Object.assign(modal, { kind });
      updateChildren(modal, content);
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
