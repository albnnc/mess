import { css, ElementTheme } from "../deps.ts";

const unchecked = `
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
      d="M416 464H96a48.05 48.05 0 01-48-48V96a48.05 48.05 0 0148-48h320a48.05 48.05 0 0148 48v320a48.05 48.05 0 01-48 48z"
    ></path>
  </svg>
`;

const checked = `
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
      d="M400 48H112a64.07 64.07 0 00-64 64v288a64.07 64.07 0 0064 64h288a64.07 64.07 0 0064-64V112a64.07 64.07 0 00-64-64zm-35.75 138.29l-134.4 160a16 16 0 01-12 5.71h-.27a16 16 0 01-11.89-5.3l-57.6-64a16 16 0 1123.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0124.5 20.58z"
    ></path>
  </svg>
`;

function getHiddenStyle() {
  return css`
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  `;
}

function getPseudoPositionStyle() {
  return css`
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 1.5rem;
    height: 1.5rem;
    border-radius: var(--radius-m);
  `;
}

function getPseudoIconStyle(icon: string, color: string) {
  return css`
    mask: url("data:image/svg+xml;base64,${btoa(icon)}") no-repeat 50% 50%;
    mask-size: cover;
    background-color: ${color};
  `;
}

export const tnCheckbox: ElementTheme = css`
  :host {
    display: block;
  }
  input {
    ${getHiddenStyle()}
    & ~ label {
      position: relative;
      padding-left: 2rem;
      cursor: pointer;
    }
    & ~ label:before {
      ${getPseudoPositionStyle()}
      ${getPseudoIconStyle(unchecked, "var(--color-surface-accent)")}
    }
    &:checked ~ label:before {
      ${getPseudoPositionStyle()}
      ${getPseudoIconStyle(checked, "var(--color-primary)")}
    }
    &:focus-visible ~ label:after {
      ${getPseudoPositionStyle()}
      outline: solid var(--color-outline);
    }
    &:disabled ~ label {
      opacity: 0.5;
      cursor: not-allowed;
    }
    &:invalid ~ label:after,
    &.invalid ~ label:after {
      ${getPseudoPositionStyle()}
      outline: solid var(--color-danger);
    }
  }
`;
