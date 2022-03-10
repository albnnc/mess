import {
  createCustomElement,
  html,
  RenderFn,
  useProp,
  useThemeStyle,
} from "../deps.ts";

export function createThemedElement<P = Record<never, never>>(
  render: RenderFn
) {
  return createCustomElement<{ kind?: string } & P>(() => {
    useProp<string | undefined>("kind", undefined);
    const style = useThemeStyle();
    const template = render();
    return html`
      <style>
        ${style}
      </style>
      ${template}
    `;
  });
}
