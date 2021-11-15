import { RenderableElement } from "../types.ts";

let currentElement: RenderableElement | undefined = undefined;

export const useElement = () => {
  if (!currentElement) {
    throw new Error("Unable to get element");
  }
  return currentElement;
};

export const claimElement = (element: RenderableElement, fn: () => void) => {
  const prior = currentElement;
  currentElement = element;
  fn();
  currentElement = prior;
};
