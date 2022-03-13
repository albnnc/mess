import { Validity } from "../types/mod.ts";

export class JsfValidityEvent extends Event {
  public constructor(public readonly validity: Validity) {
    super("jsf-validity", { bubbles: true, composed: true });
  }
}
