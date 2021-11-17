/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="deno.ns" />

// deno-lint-ignore-file no-explicit-any

export interface RenderableElement extends HTMLElement {
  render(): TemplateNode | TemplateNode[];
}

export interface RenderFn {
  (): TemplateNode | TemplateNode[];
}

export type Deps = any[];

export type Initializer<T> = T | (() => T);
export type StateUpdate<T> = T | ((v: T) => T);
export type StateSetter<T> = (update: StateUpdate<T>) => void;
export type EffectCleanup = () => void;
export type EffectCallback = (() => void) | (() => EffectCleanup);

export interface TemplateNodeObject {
  tag: string;
  attributes: Record<string, string>;
  events: Record<string, (e: Event) => void>;
  props: Record<string, any>;
  children: TemplateNode[];
}
export type TemplateNodePrimitive = string | number | null | false;
export type TemplateNode = TemplateNodeObject | TemplateNodePrimitive;
