import { path, caseUtils, algo } from "./deps.ts";

export interface ToneDescription {
  id: string;
  name: string;
}

export function describeTone(entry: string): ToneDescription {
  return {
    id: "tone_" + algo.cyrb53(entry),
    name: caseUtils.normalCase(path.basename(entry).replace(/\..+$/, "")),
  };
}
