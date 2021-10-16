export interface Hook<T> {
  ($: HookCaller): T;
}

export interface HookCaller {
  <T>(hook: Hook<T>): ReturnType<Hook<T>>;
}

export interface RenderFn {
  ($: HookCaller): HTMLElement;
}

export interface DefineOptions {
  tag: string;
}

export type Initializer<T> = T | (() => T);
export type Deps = any[];
export type EffectCleanup = () => void;
export type EffectCallback = (() => void) | (() => EffectCleanup);

export type UpperKey =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

export type Kebab<T extends string> =
  T extends `${infer L}${UpperKey}${infer R}`
    ? T extends `${L}${infer U}${R}`
      ? `${L}-${Lowercase<U>}${Kebab<R>}`
      : T
    : T;
