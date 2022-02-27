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
    padding-top: var(--space-m);
    padding-left: var(--space-m);
    padding-right: var(--space-m);
  }
`;

export const tnCardBody: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    padding: var(--space-m);
  }
`;

export const tnCardFooter: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    padding-bottom: var(--space-m);
    padding-left: var(--space-m);
    padding-right: var(--space-m);
  }
`;
