/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="deno.ns" />

export type CustomElement<P = Record<never, never>> = HTMLElement &
  P & {
    connectedCallback(): void;
    disconnectedCallback(): void;
    renderShadowContent(): Template;
  };

export interface RenderFn {
  (): Template;
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

export type TemplateNodePrimitive = string | number | null | undefined | false;
export interface TemplateNodeObject {
  tag: string;
  attributes: Record<string, string>;
  events: Record<string, (e: Event) => void>;
  props: Record<string, unknown>;
  children: Template;
}
export type TemplateNode = TemplateNodePrimitive | TemplateNodeObject;
export type TemplateArray = Template[];
export type Template = TemplateNode | TemplateArray;
