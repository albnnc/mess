export class JsfSubmitEvent extends Event {
  public constructor(public readonly value: unknown) {
    super("jsf-submit", { bubbles: true, composed: true });
  }
}
