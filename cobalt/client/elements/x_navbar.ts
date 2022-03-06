import { createCustomElement, css, html } from "../deps.ts";

export const XNavbar = createCustomElement(() => {
  return html`
    <x-layout-container>
      <style>
        ${css`
          :host {
            z-index: 1;
            position: relative;
            flex: 0 0 auto;
            background-color: var(--color-exterior);
            color: var(--color-exterior-on);
            padding: var(--space-l) 0;
            box-shadow: var(--shadow-m);
            font-weight: var(--font-weight-heading);
            letter-spacing: 0.04em;
          }
          div {
            display: flex;
            justify-content: space-between;
          }
          span {
            display: flex;
            align-items: center;
            gap: var(--space-m);
          }
          ion-icon {
            margin: -0.5em 0;
            margin-right: -0.25em;
            color: var(--color-primary);
          }
          tn-anchor {
            opacity: 0.65;
            &:hover {
              opacity: 1;
            }
          }
        `}
      </style>
      <div>
        <span>
          <ion-icon size="large" name="radio-button-on-outline" />
          <tn-anchor> UNNAMED </tn-anchor>
        </span>
        <span>
          <tn-anchor .push .href="/a">EXPLORE</tn-anchor>
          <tn-anchor .push .href="/b">AUTH</tn-anchor>
        </span>
      </div>
    </x-layout-container>
  `;
});
