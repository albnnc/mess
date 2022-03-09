import { ContextRequestEvent } from "../events/mod.ts";
import { Context } from "../types.ts";
import { useEffect } from "./use_effect.ts";
import { useElement } from "./use_element.ts";
import { useLifecycle } from "./use_lifecycle.ts";
import { useMemo } from "./use_memo.ts";

export function useContext<T extends unknown>(context: Context<T>) {
  const element = useElement();
  const data = useMemo(
    () => ({
      value: context.initialValue,
      requested: false,
    }),
    []
  );
  const { requestUpdate } = useLifecycle();
  if (!data.requested) {
    element.dispatchEvent(
      new ContextRequestEvent(
        context,
        (v) => {
          data.value = v;
          if (data.requested) {
            requestUpdate();
          }
        },
        true
      )
    );
    data.requested = true;
  }
  useEffect(() => () => (data.requested = false), []);
  return data.value;
}
