import { createContainerElement, css } from "../deps.ts";

export const XLayout = createContainerElement({
  style: css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100vw;
      min-height: 100vh;
      background-color: var(--color-background);
      color: var(--color-background-on);
    }
  `,
});

export const XLayoutHeader = createContainerElement({
  style: css`
    :host {
      display: block;
      flex: 0 0 auto;
      background-color: var(--color-exterior);
      color: var(--color-exterior-on);
      padding: var(--space-xl) 0;
    }
  `,
});

export const XLayoutBody = createContainerElement({
  style: css`
    :host {
      display: block;
      flex: 1 0 auto;
      padding: var(--space-xl) 0;
    }
  `,
});

export const XLayoutFooter = createContainerElement({
  style: css`
    :host {
      display: block;
      flex: 0 0 auto;
      background-color: var(--color-exterior);
      color: var(--color-exterior-on);
      padding: var(--space-xl) 0;
    }
  `,
});

export const XLayoutContainer = createContainerElement({
  style: css`
    :host {
      display: block;
      width: calc(100% - 2 * var(--space-l));
      max-width: 1200px;
      margin: 0 auto;
    }
  `,
});
