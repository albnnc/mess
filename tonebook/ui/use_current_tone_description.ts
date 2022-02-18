import { useMemo } from "../../rembrandt/mod.ts";
import { TONEBOOK_TONE_DESCRIPTIONS } from "./tone_descriptions.ts";
import { useLocation } from "./use_location.ts";

export function useCurrentToneDescription() {
  const location = useLocation();
  const currentToneDescription = useMemo(() => {
    const id = location.hash.replace("#", "");
    return (
      TONEBOOK_TONE_DESCRIPTIONS.find((v) => v.id === id) ??
      TONEBOOK_TONE_DESCRIPTIONS[0]
    );
  }, [location]);
  return currentToneDescription;
}
