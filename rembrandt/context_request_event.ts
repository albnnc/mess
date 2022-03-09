import { Context, ContextCallback, ContextValue } from "./types.ts";

export class ContextRequestEvent<T extends Context<unknown>> extends Event {
  public constructor(
    public readonly context: T,
    public readonly callback: ContextCallback<ContextValue<T>>,
    public readonly multiple?: boolean
  ) {
    super("context-request", { bubbles: true, composed: true });
  }
}
