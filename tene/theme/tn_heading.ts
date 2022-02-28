import { css, ElementTheme } from "../deps.ts";

export const tnHeading: ElementTheme = ({ kind }) => {
  return css`
    :host {
      box-sizing: border-box;
      display: block;
      font-size: var(--font-size-l);
      font-weight: var(--font-weight-heading);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      ${{
        card: css`
          font-size: var(--font-size-l);
        `,
        modal: css`
          font-size: var(--font-size-l);
        `,
        "1": css`
          margin-top: var(--space-m);
          margin-bottom: var(--space-s);
          font-size: var(--font-size-xxl);
        `,
        "2": css`
          margin-top: var(--space-m);
          margin-bottom: var(--space-s);
          font-size: var(--font-size-xl);
        `,
        "3": css`
          margin-top: var(--space-m);
          margin-bottom: var(--space-s);
          font-size: var(--font-size-l);
        `,
        "4": css`
          margin-top: var(--space-s);
          margin-bottom: var(--space-xs);
          font-size: var(--font-size-m);
        `,
        "5": css`
          margin-top: var(--space-s);
          margin-bottom: var(--space-xs);
          font-size: var(--font-size-s);
        `,
        "6": css`
          margin-top: var(--space-s);
          margin-bottom: var(--space-xs);
          font-size: var(--font-size-xs);
        `,
      }[kind ?? ""] ?? ""}
    }
  `;
};
