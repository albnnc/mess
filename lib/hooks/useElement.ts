import { RenderableElement } from "../types";

let currentElement: RenderableElement | undefined = undefined;

export const useElement = () => currentElement;

export const claimElement = (element: RenderableElement, fn: () => void) => {
  const prior = currentElement;
  currentElement = element;
  fn();
  currentElement = prior;
};
