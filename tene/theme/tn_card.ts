import { css, ElementTheme } from "../deps.ts";

export const tnCard: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    border-radius: var(--radius-l);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-s);
  }
`;

export const tnCardHeader: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    padding: var(--space-m);
    border-bottom: 1px solid var(--color-border);
  }
`;

export const tnCardBody: ElementTheme = ({ kind }) => css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    padding: var(--space-m);
    ${{
      list: css`
        padding: 0;
      `,
    }[kind ?? ""] ?? ""}
  }
`;

export const tnCardFooter: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    padding: var(--space-m);
    border-top: 1px solid var(--color-border);
  }
`;
