import { EFFECT_HOOK_KEY } from "../constants.ts";
import { EffectCallback, Deps, EffectCleanup } from "../types.ts";
import { compareDeps } from "../utils/mod.ts";
import { useEventListener } from "./use_event_listener.ts";
import { useChain } from "./_use_chain.ts";

export interface EffectChainItem {
  fn?: EffectCallback;
  clean?: EffectCleanup;
  deps?: Deps;
}

export function useEffect(fn: EffectCallback, deps?: Deps) {
  const [_, index, items] = useChain<EffectChainItem>(
    EFFECT_HOOK_KEY,
    (prior) => {
      if (!prior) {
        return { fn, deps };
      }
      if (!compareDeps(deps, prior.deps)) {
        Object.assign(prior, { fn, deps });
      }
      return prior;
    }
  );
  useEventListener(
    "updated",
    !index &&
      (() => {
        for (const v of items.values()) {
          if (v.clean && v.fn) {
            v.clean?.();
            delete v.clean;
          }
          const clean = v.fn?.();
          clean && (v.clean = clean);
          delete v.fn;
        }
      }),
    []
  );
  useEventListener(
    "disconnected",
    !index &&
      (() => {
        for (const v of items.values()) {
          v.clean?.();
        }
        items.clear();
      }),
    []
  );
}
