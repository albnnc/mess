import { css, ElementTheme } from "../deps.ts";

export const tnDropMenuItem: ElementTheme = ({ active }) => css`
  :host {
    display: block;
  }
  button {
    box-sizing: border-box;
    display: block;
    position: relative;
    width: 100%;
    margin: 0;
    padding: var(--space-s);
    border: none;
    outline: none;
    background: var(--color-surface);
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover,
    &:focus-visible {
      background-color: var(--color-surface-accent);
    }
    ${active &&
    css`
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        right: var(--space-s);
        transform: translateY(-50%);
        width: 1.2rem;
        height: 1.2rem;
        vertical-align: middle;
        mask: url("data:image/svg+xml;base64,${btoa(checkmark)}") no-repeat 50%
          50%;
        mask-size: cover;
        background-color: currentColor;
      }
    `}
  }
`;

const checkmark = `
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
      stroke-width="32"
      d="M416 128L192 384l-96-96"
    ></path>
  </svg>
`;
