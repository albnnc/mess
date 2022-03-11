export interface Validity {
  errors?: string[];
  items?: Validity[];
  properties?: {
    [key: string]: Validity;
  };
}
