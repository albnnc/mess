import { css, ElementTheme } from "../deps.ts";

const levels = `h1, h2, h3, h4, h5, h6`;

export const tnHeading: ElementTheme = ({ kind }) => {
  return css`
    :host {
      display: block;
    }
    ${levels} {
      box-sizing: border-box;
      margin: 0;
      font-size: var(--font-size-l);
      font-weight: var(--font-weight-heading);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: inherit;
    }

    ${{
      card: css`
        ${levels} {
          font-size: var(--font-size-l);
        }
      `,
      modal: css`
        ${levels} {
          font-size: var(--font-size-l);
        }
      `,
    }[kind ?? ""] ??
    css`
      h1: {
        margin-top: var(--space-m);
        margin-bottom: var(--space-s);
        font-size: var(--font-size-xxl);
      }
      h2: {
        margin-top: var(--space-m);
        margin-bottom: var(--space-s);
        font-size: var(--font-size-xl);
      }
      h3: {
        margin-top: var(--space-m);
        margin-bottom: var(--space-s);
        font-size: var(--font-size-l);
      }
      h4: {
        margin-top: var(--space-s);
        margin-bottom: var(--space-xs);
        font-size: var(--font-size-m);
      }
      h5: {
        margin-top: var(--space-s);
        margin-bottom: var(--space-xs);
        font-size: var(--font-size-s);
      }
      h6: {
        margin-top: var(--space-s);
        margin-bottom: var(--space-xs);
        font-size: var(--font-size-xs);
      }
    `}
  `;
};
