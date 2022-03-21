export class JsfSubmitEvent extends Event {
  public constructor(public readonly value: unknown) {
    super("jsf-submit", { bubbles: true, composed: true });
  }
}

export class JsfSubmitRequestEvent extends Event {
  public constructor() {
    super("jsf-submit-request", { bubbles: true, composed: true });
  }
}
