import { Theme } from "../deps.ts";
import { tnAcnhor } from "./tn_anchor.ts";
import { tnBadge } from "./tn_badge.ts";
import { tnButton } from "./tn_button.ts";
import { tnCard, tnCardBody, tnCardFooter, tnCardHeader } from "./tn_card.ts";
import { tnCheckbox } from "./tn_checkbox.ts";
import { tnDrop, tnDropMenu, tnDropMenuItem } from "./tn_drop.ts";
import { tnHeading } from "./tn_heading.ts";
import { tnInput } from "./tn_input.ts";
import { tnList, tnListItem } from "./tn_list.ts";
import {
  tnModal,
  tnModalBody,
  tnModalFooter,
  tnModalHeader,
} from "./tn_modal.ts";
import { tnSelect } from "./tn_select.ts";
import { tnSystem } from "./tn_system.ts";
import { tnTooltip } from "./tn_tooltip.ts";

export const theme: Theme = {
  "tn-anchor": tnAcnhor,
  "tn-badge": tnBadge,
  "tn-button": tnButton,
  "tn-card-body": tnCardBody,
  "tn-card-footer": tnCardFooter,
  "tn-card-header": tnCardHeader,
  "tn-card": tnCard,
  "tn-checkbox": tnCheckbox,
  "tn-drop-menu-item": tnDropMenuItem,
  "tn-drop-menu": tnDropMenu,
  "tn-drop": tnDrop,
  "tn-heading": tnHeading,
  "tn-input": tnInput,
  "tn-list-item": tnListItem,
  "tn-list": tnList,
  "tn-modal-body": tnModalBody,
  "tn-modal-footer": tnModalFooter,
  "tn-modal-header": tnModalHeader,
  "tn-modal": tnModal,
  "tn-select": tnSelect,
  "tn-system": tnSystem,
  "tn-tooltip": tnTooltip,
};
