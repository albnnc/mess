import { css, ElementTheme } from "../deps.ts";
import { colorKinds } from "./_common.ts";

function getColorKindTheme(kind: string) {
  if (!colorKinds.has(kind)) {
    return "";
  }
  return css`
    background-color: var(--color-${kind});
    color: var(--color-${kind}-on);
  `;
}

export const tnBadge: ElementTheme = ({ kind }) => css`
  :host {
    display: inline-block;
    box-sizing: border-box;
    padding: var(--space-xxs) var(--space-xs);
    font-size: var(--font-size-s);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-radius: var(--radius-m);
    ${getColorKindTheme(kind)}
  }
`;
