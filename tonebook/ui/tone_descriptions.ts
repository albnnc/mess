import { ToneDescription } from "../describe_tone.ts";

export const { TONEBOOK_TONE_DESCRIPTIONS = [] } = globalThis as unknown as {
  TONEBOOK_TONE_DESCRIPTIONS?: ToneDescription[];
};
