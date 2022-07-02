/** @jsx h */
import { h } from "../sx/h.tsx";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div>
      <div sx={{ color: "blue" }}>static server sx</div>
      <Counter start={0} />
    </div>
  );
}
