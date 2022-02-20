import { css, ElementTheme } from "../deps.ts";

export const tnInput: ElementTheme = css`
  input {
    width: 100%;
    padding: var(--space-s);
    line-height: calc(1.5 * 1rem);
    font-size: var(--font-size-m);
    /* border: 1px solid var(--color-border); */
    border: none;
    border-radius: var(--radius-m);
    outline: none;
    /* background: transparent; */
    /* color: var(--color-surface-on); */
    background-color: var(--color-secondary);
    color: var(--color-secondary-on);
    opacity: 0.7;
    &:focus {
      opacity: 1;
      outline: solid var(--color-outline);
      /* border: 1px solid var(--color-primary); */
      /* box-shadow: inset 0 0 0 1px var(--color-primary); */
    }
    /* &:disabled {
      border: 1px dashed var(--color-border);
      pointer-events: none;
    } */
  }
`;
