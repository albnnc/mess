import {
  createCustomElement,
  html,
  useMemo,
  useProp,
  useThemeStyle,
} from "../deps.ts";

type Level = number | string;
const levels: Level[] = [1, 2, 3, 4, 5, 6];

export const TnHeading = createCustomElement(() => {
  const style = useThemeStyle();
  const [level] = useProp<Level>(3, { name: "level" });
  const tag = useMemo(
    () =>
      levels.includes(level) ||
      levels.map((v) => v.toString() as Level).includes(level)
        ? `h${level}`
        : "h3",
    [level]
  );
  return html`
    <style>
      ${style}
    </style>
    <${tag}>
      <slot></slot>
    </${tag}>
  `;
});
