import { createCustomElement, css, html } from "../deps.ts";

export const XLoginPage = createCustomElement(() => {
  return html`
    <style>
      ${css`
        :host {
          display: flex;
          justify-content: center;
          height: 100%;
        }
        tn-card {
          min-width: 350px;
        }
        tn-card-body {
          display: flex;
          flex-direction: column;
          gap: var(--space-m);
        }
      `}
    </style>
    <tn-card>
      <tn-card-header>
        <tn-heading .kind="card">Login</tn-heading>
      </tn-card-header>
      <tn-card-body>
        <tn-input .placeholder="login" />
        <tn-input .placeholder="password" />
        <tn-button .kind="primary">Login</tn-button>
      </tn-card-body>
    </tn-card>
  `;
});
