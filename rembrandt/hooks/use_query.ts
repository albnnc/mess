import { useEffect } from "./use_effect.ts";
import { useElement } from "./use_element.ts";
import { useState } from "./use_state.ts";

export function useQuery(query: string) {
  const { shadowRoot } = useElement();
  const [queryOutput, setQueryOutput] = useState<Element[]>([]);
  useEffect(() => {
    if (!shadowRoot) {
      return;
    }
    const handleUpdate = () => {
      setQueryOutput(Array.from(shadowRoot.querySelectorAll(query)));
    };
    handleUpdate();
    const observer = new MutationObserver(handleUpdate);
    observer.observe(shadowRoot, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
    };
  }, [shadowRoot]);
  return queryOutput;
}
