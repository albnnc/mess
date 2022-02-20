/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="deno.ns" />

export interface RenderableElement extends HTMLElement {
  render(): TemplateNode | TemplateNode[];
}

export interface RenderFn {
  (): TemplateNode | TemplateNode[];
}

export type Deps = unknown[];

export type Initializer<T> = T | (() => T);
export type StateUpdate<T> = T | ((v: T) => T);
export type StateSetter<T> = (update: StateUpdate<T>) => void;
export type EffectCleanup = () => void;
export type EffectCallback = (() => void) | (() => EffectCleanup);

export interface Context<T> {
  name: string;
  initialValue?: T;
}
export type ContextValue<T extends Context<unknown>> = T extends Context<
  infer V
>
  ? V
  : never;
export type ContextCallback<T> = (value: T, dispose?: () => void) => void;

export interface TemplateNodeObject {
  tag: string;
  attributes: Record<string, string>;
  events: Record<string, (e: Event) => void>;
  props: Record<string, unknown>;
  children: TemplateNode[];
}
export type TemplateNodePrimitive = string | number | null | false;
export type TemplateNode = TemplateNodeObject | TemplateNodePrimitive;