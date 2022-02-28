import { css, ElementTheme } from "../deps.ts";

export const tnModal: ElementTheme = ({ kind }) => css`
  :host {
    display: block;
  }
  [part="backdrop"] {
    content: "";
    display: block;
    z-index: 9000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.65);
    animation: 0.15s ease-out fade;
  }
  [part="content"] {
    box-sizing: border-box;
    z-index: 9100;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: var(--radius-l);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-xl);
    animation: 0.15s ease-out slide;
  }
  ${{
    small: css`
      [part="content"] {
        width: 400px;
      }
    `,
    medium: css`
      [part="content"] {
        width: 550px;
      }
    `,
    large: css`
      [part="content"] {
        width: 650px;
      }
    `,
    question: css`
      [part="content"] {
        width: 400px;
      }
    `,
  }[kind ?? ""] ?? ""}
  @keyframes slide {
    from {
      transform: translate(-50%, calc(-50% + 1rem));
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const tnModalHeader: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    padding-top: var(--space-m);
    padding-left: var(--space-m);
    padding-right: var(--space-m);
  }
`;

export const tnModalBody: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    padding: var(--space-m);
  }
`;

export const tnModalFooter: ElementTheme = css`
  :host {
    display: block;
  }
  div {
    box-sizing: border-box;
    padding-bottom: var(--space-m);
    padding-left: var(--space-m);
    padding-right: var(--space-m);
  }
`;
