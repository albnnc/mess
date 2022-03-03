import { css, ElementTheme } from "../deps.ts";
import { colorKinds } from "./_common.ts";

function getColorKindTheme(kind: string) {
  if (!colorKinds.has(kind)) {
    return "";
  }
  return css`
    padding: var(--space-s) var(--space-m);
    background-color: var(--color-${kind});
    color: var(--color-${kind}-on);
    font-size: var(--font-size-s);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    &:hover {
      background-color: var(--color-${kind}-accent);
    }
  `;
}

export const tnButton: ElementTheme = ({ kind }) => css`
  :host {
    display: inline-block;
  }
  button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: var(--radius-m);
    outline: none;
    background: transparent;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
    user-select: none;
    &:focus-visible {
      outline: solid var(--color-outline);
    }
    &:disabled {
      opacity: 0.5;
    }
    ${getColorKindTheme(kind)}
  }
`;
