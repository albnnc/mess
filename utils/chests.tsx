import { createContext } from "preact";
import { createChest } from "delta-chest";

export const createChests = (value: number) => {
  return {
    countResource: createChest(value),
  };
};

export const ChestsContext = createContext(createChests(0));
