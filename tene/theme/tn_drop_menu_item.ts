import { css, ElementTheme } from "../deps.ts";

export const tnDropMenuItem: ElementTheme = css`
  :host {
    display: block;
  }
  button {
    box-sizing: border-box;
    display: block;
    width: 100%;
    margin: 0;
    padding: var(--space-s);
    border: none;
    outline: none;
    background: var(--color-surface);
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    user-select: none;
    &:hover,
    &:focus-visible {
      background-color: var(--color-surface-accent);
    }
  }
`;
