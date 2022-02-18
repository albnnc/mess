import { css } from "../deps.ts";

export const button = css`
  button {
    padding: 0.5rem 1rem;
    border-radius: 2px;
    background-color: #5da2de;
    color: #ffffff;
    fontsize: 2;
    font-family: Arial, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    outline: none;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: #4a8dc7;
    }
  }
`;
