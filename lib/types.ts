export interface Hook<T> {
  ($: HookCaller): T;
}

export interface HookCaller {
  <T>(hook: Hook<T>): ReturnType<Hook<T>>;
}

export interface RenderFn {
  ($: HookCaller): TemplateNode | TemplateNode[];
}

export interface DefineOptions {
  tag: string;
}

export type Initializer<T> = T | (() => T);
export type Deps = any[];
export type EffectCleanup = () => void;
export type EffectCallback = (() => void) | (() => EffectCleanup);

export interface TemplateNodeObject {
  tag: string;
  attributes: Record<string, string>;
  events: Record<string, (e: Event) => void>;
  props: Record<string, any>;
  children: TemplateNode[];
}
export type TemplateNodePrimitive = number | string;
export type TemplateNode = TemplateNodeObject | TemplateNodePrimitive;
