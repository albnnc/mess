import { css, ElementTheme } from "../deps.ts";

export const tnInput: ElementTheme = css`
  :host {
    box-sizing: border-box;
    display: block;
  }
  input {
    box-sizing: border-box;
    width: 100%;
    padding: var(--space-s);
    line-height: calc(1.5 * 1rem);
    font-size: var(--font-size-m);
    border: none;
    border-radius: var(--radius-m);
    outline: none;
    background-color: var(--color-secondary);
    color: var(--color-secondary-on);
    opacity: 0.75;
    &:focus {
      opacity: 1;
      outline: solid var(--color-outline);
    }
    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    &::placeholder {
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
      opacity: 0.5;
    }
  }
`;
