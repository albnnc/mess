import { EVENT_LISTENER_HOOK_KEY } from "../constants.ts";
import { Deps } from "../types.ts";
import { compareDeps } from "../utils/mod.ts";
import { useElement } from "./use_element.ts";
import { useChain } from "./_use_chain.ts";

export interface EventListenerChainItem {
  listener: EventListener | undefined | false;
  deps: Deps;
}

// export function useEventListener<K extends keyof HTMLElementEventMap>(
//   type: K,
//   listener: ((ev: HTMLElementEventMap[K]) => void) | undefined | false,
//   deps: Deps
// ): void;

export function useEventListener(
  type: string,
  listener: EventListener | undefined | false,
  deps: Deps
): void {
  const element = useElement();
  useChain<EventListenerChainItem>(EVENT_LISTENER_HOOK_KEY, (prior) => {
    if (prior && compareDeps(prior.deps, deps)) {
      return prior;
    }
    prior?.listener && element.removeEventListener(type, prior?.listener);
    listener && element.addEventListener(type, listener);
    return { listener, deps };
  });
}
