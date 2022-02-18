import { CONTEXT_HOOK_KEY } from "../constants.ts";
import { ContextRequestEvent } from "../context_request_event.ts";
import { Context, ContextCallback } from "../types.ts";
import { useEffect } from "./use_effect.ts";
import { useEventListener } from "./use_event_listener.ts";
import { useChain } from "./_use_chain.ts";

export interface ContextProviderChainItem<T> {
  context: Context<T>;
  value: T;
  callbacks: Set<ContextCallback<T>>;
}

// TODO: Add dispose handling.
export function useContextProvider<T>(context: Context<T>, value: T) {
  const [item, index, items] = useChain<ContextProviderChainItem<T>>(
    CONTEXT_HOOK_KEY,
    (prior) => {
      const updates = { context, value };
      if (!prior) {
        return { ...updates, callbacks: new Set() };
      }
      Object.assign(prior, updates);
      return prior;
    }
  );
  useEventListener(
    "context-request",
    !index &&
      ((ev) => {
        const { context, callback, multiple } = ev as ContextRequestEvent<
          Context<unknown>
        >; // FIXME
        for (const v of items.values()) {
          if (context.name === v.context.name) {
            callback(v.value);
            if (multiple) {
              v.callbacks.add(callback);
            }
            ev.stopPropagation();
          }
        }
      }),
    []
  );
  useEffect(() => {
    for (const fn of item.callbacks.values()) {
      fn(value);
    }
  }, [value]);
}
