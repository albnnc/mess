import { css, ElementTheme } from "../deps.ts";
import { checkmarkIcon } from "./_common.ts";

export const tnDrop: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--radius-m);
    background-color: var(--color-surface);
    color: var(--color-surface-on);
    box-shadow: var(--shadow-m);
    animation: 0.15s ease-out slide;
  }
  @keyframes slide {
    from {
      transform: translateY(-1rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const tnDropMenu: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-height: 300px;
    overflow-y: auto;
  }
`;

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
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
        mask: url("data:image/svg+xml;base64,${btoa(checkmarkIcon)}") no-repeat
          50% 50%;
        mask-size: cover;
        background-color: currentColor;
      }
    `}
  }
`;
