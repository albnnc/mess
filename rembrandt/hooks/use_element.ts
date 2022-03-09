let currentElement: HTMLElement | undefined = undefined;

export const useElement = () => {
  if (!currentElement) {
    throw new Error("Unable to get element");
  }
  return currentElement;
};

export const claimElement = (element: HTMLElement, fn: () => void) => {
  const prior = currentElement;
  currentElement = element;
  fn();
  currentElement = prior;
};
