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
