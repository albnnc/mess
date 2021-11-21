export interface ProcessedBuildEntry {
  id: string;
  files: Record<string, string>;
}

export interface BuildOptions {
  watch?: boolean;
  entries: string;
  processEntry: (entry: string) => Promise<ProcessedBuildEntry>;
}

export interface BuildSheetOptions {
  entry: string;
  outputDir: string;
  processEntry: (entry: string) => Promise<ProcessedBuildEntry>;
}
