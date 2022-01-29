import { ContextRequestEvent } from "../context_request_event.ts";
import { Context, ContextCallback } from "../types.ts";
import { useEffect } from "./use_effect.ts";
import { useElement } from "./use_element.ts";
import { useMemo } from "./use_memo.ts";

export function useContextProvider<T extends unknown>(
  context: Context<T>,
  value: T
) {
  const element = useElement();
  const callbacks = useMemo(() => new Set<ContextCallback<T>>(), []);
  useEffect(() => {
    callbacks.clear();
  }, [context]);
  useEffect(() => {
    for (const fn of callbacks.values()) {
      fn(value);
    }
  }, [value]);
  useEffect(() => {
    const handleContextRequest = (
      ev: ContextRequestEvent<Context<unknown>>
    ) => {
      console.log("got event");
      if (ev.context.name === context.name) {
        ev.callback(value);
        if (ev.multiple) {
          callbacks.add(ev.callback);
        }
        ev.stopPropagation();
      }
    };
    console.log("registering listener", element);
    element.addEventListener("context-request", handleContextRequest);
    return () => {
      element.removeEventListener("context-request", handleContextRequest);
    };
  }, [context, value]);
}
