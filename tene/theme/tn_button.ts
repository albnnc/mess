import { css, ElementTheme } from "../deps.ts";

const basicKinds = new Set([
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
]);

function getBasicKind(kind: string) {
  if (!basicKinds.has(kind)) {
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
  button {
    outline: none;
    border: none;
    border-radius: var(--radius-s);
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    background: transparent;
    color: inherit;
    border: none;
    user-select: none;
    &:focus {
      outline: solid var(--color-outline);
    }
    ${getBasicKind(kind)}
  }
`;
