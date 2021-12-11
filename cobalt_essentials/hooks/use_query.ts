import { useEffect, useElement, useState } from "../deps.ts";

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
