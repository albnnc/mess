import { css, ElementTheme } from "../deps.ts";

export const tnList: ElementTheme = css`
  :host {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
`;

export const tnListItem: ElementTheme = ({ kind }) => css`
  :host {
    box-sizing: border-box;
    display: flex;
    padding: var(--space-m);
    ${{
      pair: css`
        justify-content: space-between;
      `,
    }[kind ?? ""] ?? ""}
  }
  :host(:not(:first-child)) {
    border-top: 1px solid var(--color-border);
  }
`;
