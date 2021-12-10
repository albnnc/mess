import { path, caseUtils } from "./deps.ts";
import { cyrb53 } from "./cyrb53.ts";

export interface ToneDescription {
  id: string;
  name: string;
}

export function describeTone(entry: string): ToneDescription {
  return {
    id: "tone_" + cyrb53(entry),
    name: caseUtils.normalCase(path.basename(entry).replace(/\..+$/, "")),
  };
}
