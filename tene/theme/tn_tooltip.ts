import { css, ElementTheme } from "../deps.ts";

export const tnTooltip: ElementTheme = css`
  :host {
    box-sizing: border-box;
    display: block;
  }
`;

export const tnTooltipContent: ElementTheme = css`
  :host {
    box-sizing: border-box;
    display: block;
    padding: var(--space-m);
    border-radius: var(--radius-m);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    pointer-events: none;
  }
`;
