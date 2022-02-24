import { css, ElementTheme } from "../deps.ts";

export const tnSelect: ElementTheme = css`
  :host {
    --arrow-size: 5px;
    display: block;
  }
  button {
    box-sizing: border-box;
    position: relative;
    padding: var(--space-s);
    width: 100%;
    min-width: 250px;
    height: calc(1.5 * 1rem + 2 * var(--space-s));
    line-height: calc(1.5 * 1rem);
    font-size: var(--font-size-m);
    border-radius: var(--radius-m);
    outline: none;
    border: none;
    text-align: start;
    background-color: var(--color-secondary);
    color: var(--color-secondary-on);
    opacity: 0.75;
    cursor: pointer;
    &:focus-visible {
      opacity: 1;
      outline: solid var(--color-outline);
    }
    &.disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    &.invalid {
      outline: solid var(--color-danger);
    }
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: calc(50% + var(--arrow-size) / 2);
      right: var(--space-s);
      transform: translateY(-50%);
      border: var(--arrow-size) solid transparent;
      border-top-color: var(--color-secondary-on);
      opacity: 0.65;
    }
    & .placeholder {
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
      opacity: 0.5;
    }
  }
`;
