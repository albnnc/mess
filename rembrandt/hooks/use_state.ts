import { STATE_HOOK_KEY } from "../constants.ts";
import { Initializer, StateUpdate, StateSetter } from "../types.ts";
import { getInitialValue } from "../utils/mod.ts";
import { useLifecycle } from "./use_lifecycle.ts";
import { useChain } from "./_use_chain.ts";
import { useEventListener } from "./use_event_listener.ts";

export interface StateChainItem<T> {
  value: T;
  setValue: StateSetter<T>;
  update?: T;
}

export function useState<T>(initializer: Initializer<T>) {
  let state: [T, StateSetter<T>];
  const { requestUpdate } = useLifecycle();
  const [_, index, items] = useChain<StateChainItem<T>>(
    STATE_HOOK_KEY,
    (prior) => {
      const next = prior ?? {
        value: getInitialValue(initializer),
        setValue: (update: StateUpdate<T>) => {
          next.update =
            update instanceof Function
              ? "update" in next
                ? update(next.update!)
                : update(next.value)
              : update;
          requestUpdate();
        },
      };
      const { value, setValue } = next;
      state = [value, setValue];
      return next;
    }
  );
  useEventListener(
    "update",
    !index &&
      (() => {
        items.forEach((v) => {
          if ("update" in v) {
            v.value = v.update!;
            delete v.update;
          }
        });
      }),
    []
  );
  return state!;
}
