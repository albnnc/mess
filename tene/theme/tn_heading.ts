import { css, ElementTheme } from "../deps.ts";

export const tnHeading: ElementTheme = ({ kind }) => {
  console.log("kind", kind);
  return css`
    :host {
      display: block;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      box-sizing: border-box;
      font-size: var(--font-size-l);
      font-weight: var(--font-weight-heading);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: inherit;
    }

    ${{
      card: css`
        h3 {
          margin: 0;
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
