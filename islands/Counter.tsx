/** @jsx jsx */
import { jsx } from "@theme-ui/core";
import { useContext } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useTranslation } from "react-i18next";
import { withTranslation } from "../utils/withTranslation.tsx";
import { ChestsContext } from "../utils/chests.tsx";

interface CounterProps {
  start: number;
  class?: string;
}

export default withTranslation(({ start, ...rest }: CounterProps) => {
  console.log(1);
  const [t] = useTranslation("common");
  console.log(2);
  const { countResource } = useContext(ChestsContext);
  const count = countResource.use();
  console.log("count", count);
  return (
    <div {...rest}>
      <p sx={{ color: count % 2 ? "blue" : "red" }}>{t("count", { count })}</p>
      <button
        onClick={() => countResource.set(count - 1)}
        disabled={!IS_BROWSER}
      >
        -1
      </button>
      <button
        onClick={() => countResource.set(count + 1)}
        disabled={!IS_BROWSER}
      >
        +1
      </button>
    </div>
  );
});
