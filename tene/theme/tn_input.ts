import { css, ElementTheme } from "../deps.ts";

export const tnInput: ElementTheme = css`
  input {
    width: 100%;
    padding: var(--space-s);
    line-height: calc(1.5 * 1rem);
    font-size: var(--font-size-m);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-m);
    outline: none;
    background: transparent;
    color: var(--color-surface-on);
    &:focus {
      border: 1px solid var(--color-primary);
      box-shadow: inset 0 0 0 1px var(--color-primary);
    }
    &:disabled {
      border: 1px dashed var(--color-border);
      pointer-events: none;
    }
  }
`;
