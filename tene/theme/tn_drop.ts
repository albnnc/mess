import { css, ElementTheme } from "../deps.ts";

export const tnDrop: ElementTheme = ({ kind }) => css`
  div {
    box-sizing: border-box;
    padding: var(--space-m);
    border-radius: var(--radius-m);
    background-color: var(--color-surface);
    color: var(--color-surface-on);
    box-shadow: var(--shadow-m);
    ${{
      "slide-in": css`
        animation: 0.15s ease-out slide-in;
      `,
    }[kind ?? ""] ?? ""}
  }
  @keyframes slide-in {
    from {
      transform: translateY(1rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
