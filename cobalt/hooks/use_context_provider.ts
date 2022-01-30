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
  const data = useMemo(
    () => ({
      context,
      value,
      listening: false,
      callbacks: new Set<ContextCallback<T>>(),
    }),
    []
  );
  if (!data.listening) {
    data.listening = true;
    const handleContextRequest = (
      ev: ContextRequestEvent<Context<unknown>>
    ) => {
      if (ev.context.name === data.context.name) {
        ev.callback(data.value);
        if (ev.multiple) {
          data.callbacks.add(ev.callback);
        }
        ev.stopPropagation();
      }
    };
    element.addEventListener("context-request", handleContextRequest);
  }
  useEffect(() => {
    data.context = context;
    data.callbacks.clear();
  }, [context]);
  useEffect(() => {
    data.value = value;
    for (const fn of data.callbacks.values()) {
      fn(value, () => {
        data.callbacks.delete(fn);
      });
    }
  }, [value]);
}
