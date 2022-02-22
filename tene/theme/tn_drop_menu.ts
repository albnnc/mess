import { css, ElementTheme } from "../deps.ts";

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
  }
`;
