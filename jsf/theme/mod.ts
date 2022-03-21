import { css } from "../deps.ts";

export const theme = {
  "jsf-form": css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-m);
    }
  `,
  "jsf-object-layout": css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-s);
    }
    .properties {
      display: flex;
      flex-direction: column;
      gap: var(--space-m);
    }
  `,
  "jsf-primitive-layout": css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-s);
    }
  `,
  "jsf-error-list": css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      color: var(--color-danger);
    }
  `,
};
