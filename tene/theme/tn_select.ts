import { css, ElementTheme } from "../deps.ts";

const chevron = `
  <svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 512 512"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="48"
      d="M112 184l144 144 144-144"
    ></path>
  </svg>
`;

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
    background-color: var(--color-surface-accent);
    color: var(--color-surface-on);
    cursor: pointer;
    &:focus-visible {
      outline: solid var(--color-outline);
    }
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    &.invalid {
      outline: solid var(--color-danger);
    }
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      right: var(--space-s);
      transform: translateY(-50%);
      width: 1.2rem;
      height: 1.2rem;
      mask: url("data:image/svg+xml;base64,${btoa(chevron)}") no-repeat 50% 50%;
      mask-size: cover;
      background-color: currentColor;
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
