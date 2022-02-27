import { css, ElementTheme } from "../deps.ts";
import { checkmarkIcon } from "./_common.ts";

const hiddenStyle = css`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

const pseudoPositionStyle = css`
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 1.4rem;
  height: 1.4rem;
  border-radius: var(--radius-m);
`;

const pseudoIconStyle = css`
  mask: url("data:image/svg+xml;base64,${btoa(checkmarkIcon)}") no-repeat 50%
    50%;
  mask-size: cover;
  background-color: var(--color-primary-on);
`;

export const tnCheckbox: ElementTheme = css`
  :host {
    display: block;
  }
  input {
    ${hiddenStyle}
    & ~ label {
      position: relative;
      padding-left: 2rem;
      cursor: pointer;
    }
    & ~ label:before {
      ${pseudoPositionStyle}
      background-color: var(--color-surface-accent);
    }
    &:checked ~ label:before {
      ${pseudoPositionStyle}
      background-color: var(--color-primary);
    }
    &:checked ~ label::after {
      ${pseudoPositionStyle}
      ${pseudoIconStyle}
    }
    &:focus-visible ~ label:before {
      outline: solid var(--color-outline);
    }
    &:disabled ~ label {
      opacity: 0.5;
      cursor: not-allowed;
    }
    &:invalid ~ label:before,
    &.invalid ~ label:before {
      outline: solid var(--color-danger);
    }
  }
`;
