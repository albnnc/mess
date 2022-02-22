import { css, ElementTheme } from "../deps.ts";

export const tnDropMenuItem: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    padding: var(--space-s);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    &:hover {
      background-color: var(--color-surface-accent);
    }
  }
`;
