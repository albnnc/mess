import { useContext } from "preact/hooks";
import { ChestsContext } from "../utils/chests.tsx";

export function CountHeading() {
  const { countResource } = useContext(ChestsContext);
  const count = countResource.use();
  return `count is ${count}`;
}
