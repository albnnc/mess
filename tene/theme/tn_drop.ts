import { css, ElementTheme } from "../deps.ts";

export const tnDrop: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--radius-m);
    background-color: var(--color-surface);
    color: var(--color-surface-on);
    box-shadow: var(--shadow-m);
    animation: 0.15s ease-out slide;
  }
  @keyframes slide {
    from {
      transform: translateY(-1rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
