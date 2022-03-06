import { createContainerElement, css } from "../deps.ts";

export const AppLayout = createContainerElement({
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

export const AppLayoutHeader = createContainerElement({
  style: css`
    :host {
      display: block;
      flex: 0 0 auto;
      background-color: var(--color-surface);
      color: var(--color-surface-on);
      padding: var(--space-xl) 0;
    }
  `,
});

export const AppLayoutBody = createContainerElement({
  style: css`
    :host {
      display: block;
      flex: 1 0 auto;
      padding: var(--space-xl) 0;
    }
  `,
});

export const AppLayoutFooter = createContainerElement({
  style: css`
    :host {
      display: block;
      flex: 0 0 auto;
      background-color: var(--color-surface);
      color: var(--color-surface-on);
      padding: var(--space-xl) 0;
    }
  `,
});

export const AppLayoutContainer = createContainerElement({
  style: css`
    :host {
      display: block;
      max-width: 1200px;
      padding: 0 var(--space-l);
      margin: 0 auto;
    }
  `,
});
