import { TypeDef } from "../mod.ts";

export type StringSchema = Partial<{
  minLength: number;
  maxLength: number;
  pattern: string;
  format: "date-time" | "email" | "hostname" | "ipv4" | "ipv6" | "uri";
  enum: string[];
}> &
  TypeDef<"string">;
