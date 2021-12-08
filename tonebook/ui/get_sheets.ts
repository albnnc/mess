import { BuildSheetResult } from "../build_sheet.ts";

const { padSheets = [] } = globalThis as unknown as {
  padSheets?: BuildSheetResult[];
};

export function getSheets(): BuildSheetResult[] {
  return padSheets;
}
