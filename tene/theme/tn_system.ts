import { css, ElementTheme } from "../deps.ts";

export const tnSystem: ElementTheme = css`
  :host {
    --color-primary: #5897cf;
    --color-primary-accent: #4687c0;
    --color-primary-on: #ffffff;
    --color-secondary: #3c4146;
    --color-secondary-accent: #303438;
    --color-secondary-on: #fafafa;
    --color-success: #53b956;
    --color-success-accent: #40aa44;
    --color-success-on: #ffffff;
    --color-warning: #eca843;
    --color-warning-accent: #d69431;
    --color-warning-on: #ffffff;
    --color-danger: #ef6d64;
    --color-danger-accent: #df5248;
    --color-danger-on: #ffffff;
    --color-unknown: #b3b3b3;
    --color-unknown-accent: #a3a3a3;
    --color-unknown-on: #ffffff;
    --color-surface: #202224;
    --color-surface-accent: #2b2e31;
    --color-surface-on: #dbdbdb;
    --color-background: #181a1b;
    --color-background-accent: #1c1f20;
    --color-background-on: #b1b1b1;
    --color-exterior: #202224;
    --color-exterior-accent: #2b2e31;
    --color-exterior-on: #fafafa;
    --color-outline: #ffffff;
    --color-outline-accent: #ffffff;
    --color-outline-on: #333333;
    --color-border: rgba(255, 255, 255, 0.15);
    --color-border-accent: rgba(255, 255, 255, 0.45);
    --color-border-on: #fafafa;

    --space-xxs: 2px;
    --space-xs: 4px;
    --space-s: 8px;
    --space-m: 16px;
    --space-l: 32px;
    --space-xl: 64px;
    --space-xxl: 128px;

    --radius-s: 2px;
    --radius-m: 4px;
    --radius-l: 8px;

    --font-size-xxs: 10px;
    --font-size-xs: 12px;
    --font-size-s: 14px;
    --font-size-m: 16px;
    --font-size-l: 18px;
    --font-size-xl: 22px;
    --font-size-xxl: 40px;

    --font-weight-normal: 400;
    --font-weight-heading: 300;

    --font-family-normal: Roboto, "Helvetica Neue", sans-serif;
    --font-family-monospace: Menlo, monospace;

    --shadow-xxs: 0px 2px 1px -1px rgba(0, 0, 0, 0.12),
      0px 1px 1px 0px rgba(0, 0, 0, 0.12), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    --shadow-xs: 0px 3px 1px -2px rgba(0, 0, 0, 0.12),
      0px 2px 2px 0px rgba(0, 0, 0, 0.12), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    --shadow-s: 0px 3px 3px -2px rgba(0, 0, 0, 0.12),
      0px 3px 4px 0px rgba(0, 0, 0, 0.12), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
    --shadow-m: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
      0px 4px 5px 0px rgba(0, 0, 0, 0.12), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    --shadow-l: 0px 3px 5px -1px rgba(0, 0, 0, 0.12),
      0px 6px 10px 0px rgba(0, 0, 0, 0.12), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
    --shadow-xl: 0px 5px 5px -3px rgba(0, 0, 0, 0.12),
      0px 8px 10px 1px rgba(0, 0, 0, 0.12), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
    --shadow-xxl: 0px 6px 6px -3px rgba(0, 0, 0, 0.12),
      0px 10px 14px 1px rgba(0, 0, 0, 0.12),
      0px 4px 18px 3px rgba(0, 0, 0, 0.12);

    font-size: var(--font-size-m);
    font-weight: var(--font-weight-normal);
    font-family: var(--font-family-normal);
  }
`;
