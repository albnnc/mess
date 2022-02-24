import { Theme } from "../deps.ts";
import { tnButton } from "./tn_button.ts";
import { tnDrop } from "./tn_drop.ts";
import { tnDropMenu } from "./tn_drop_menu.ts";
import { tnDropMenuItem } from "./tn_drop_menu_item.ts";
import { tnInput } from "./tn_input.ts";
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
};
