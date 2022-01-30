import { ContextRequestEvent } from "../context_request_event.ts";
import { Context } from "../types.ts";
import { useEffect } from "./use_effect.ts";
import { useElement } from "./use_element.ts";
import { useState } from "./use_state.ts";

export function useContext<T extends unknown>(context: Context<T>) {
  const element = useElement();
  const [value, setValue] = useState(context.initialValue);
  useEffect(() => {
    element.dispatchEvent(new ContextRequestEvent(context, setValue));
  }, []);
  return value;
}
