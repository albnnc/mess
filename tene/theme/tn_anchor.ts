import { css, ElementTheme } from "../deps.ts";

export const tnAcnhor: ElementTheme = css`
  :host {
    display: inline-block;
    box-sizing: border-box;
  }
  a {
    border-radius: var(--radius-m);
    color: inherit;
    font-size: inherit;
    cursor: pointer;
    &,
    &:visited,
    &:active {
      text-decoration: none;
      outline: none;
    }
    &:focus-visible {
      outline: solid var(--color-outline);
    }
  }
`;
