import { Theme } from "../deps.ts";
import { tnButton } from "./tn_button.ts";
import { tnCard, tnCardBody, tnCardFooter, tnCardHeader } from "./tn_card.ts";
import { tnCheckbox } from "./tn_checkbox.ts";
import { tnDrop, tnDropMenu, tnDropMenuItem } from "./tn_drop.ts";
import { tnHeading } from "./tn_heading.ts";
import { tnInput } from "./tn_input.ts";
import {
  tnModal,
  tnModalBody,
  tnModalFooter,
  tnModalHeader,
} from "./tn_modal.ts";
import { tnSelect } from "./tn_select.ts";
import { tnSystem } from "./tn_system.ts";

export const theme: Theme = {
  "tn-system": tnSystem,
  "tn-button": tnButton,
  "tn-drop-menu-item": tnDropMenuItem,
  "tn-drop-menu": tnDropMenu,
  "tn-drop": tnDrop,
  "tn-input": tnInput,
  "tn-select": tnSelect,
  "tn-checkbox": tnCheckbox,
  "tn-card": tnCard,
  "tn-card-header": tnCardHeader,
  "tn-card-body": tnCardBody,
  "tn-card-footer": tnCardFooter,
  "tn-modal": tnModal,
  "tn-modal-header": tnModalHeader,
  "tn-modal-body": tnModalBody,
  "tn-modal-footer": tnModalFooter,
  "tn-heading": tnHeading,
};
