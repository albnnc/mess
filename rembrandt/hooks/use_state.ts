import { STATE_HOOK_KEY } from "../constants.ts";
import { Initializer, StateUpdate, StateSetter } from "../types.ts";
import { getInitialValue } from "../utils/mod.ts";
import { useLifecycle } from "./use_lifecycle.ts";
import { useChain } from "./_use_chain.ts";

export interface StateChainItem<T> {
  value: T;
  setValue: StateSetter<T>;
}

export function useState<T>(initializer: Initializer<T>) {
  let state: [T, StateSetter<T>];
  const { requestUpdate } = useLifecycle();
  useChain<StateChainItem<T>>(STATE_HOOK_KEY, (prior) => {
    const next = prior ?? {
      value: getInitialValue(initializer),
      setValue: (update: StateUpdate<T>) => {
        next.value = update instanceof Function ? update(next.value) : update;
        requestUpdate();
      },
    };
    const { value, setValue } = next;
    state = [value, setValue];
    return next;
  });
  return state!;
}
