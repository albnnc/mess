export class JsfValueEvent extends Event {
  public constructor(public readonly value: unknown) {
    super("jsf-value", { bubbles: true, composed: true });
  }
}
