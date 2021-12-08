import { ToneMeta } from "../build_tone.ts";

export const { TONEBOOK_TONES = [] } = globalThis as unknown as {
  TONEBOOK_TONES?: ToneMeta[];
};
