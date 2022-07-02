/** @jsx h */
import { h } from "../sx/h.tsx";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface CounterProps {
  start: number;
  class?: string;
}

export default function Counter({ start, ...rest }: CounterProps) {
  const [count, setCount] = useState(start);
  return (
    <div {...rest}>
      <p sx={{ color: count % 2 ? "red" : "green" }}>
        island sx, count is {count}
      </p>
      <button onClick={() => setCount(count - 1)} disabled={!IS_BROWSER}>
        -1
      </button>
      <button onClick={() => setCount(count + 1)} disabled={!IS_BROWSER}>
        +1
      </button>
    </div>
  );
}
