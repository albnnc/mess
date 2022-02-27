import {
  createCustomElement,
  html,
  useMemoFn,
  useProp,
  useThemeStyle,
} from "../deps.ts";

export const TnCheckbox = createCustomElement(() => {
  const style = useThemeStyle();
  const [checked, setChecked] = useProp(false, { name: "checked" });
  const [disabled] = useProp(false, { name: "disabled" });
  const [invalid] = useProp(false, { name: "invalid" });
  const handleKeypress = useMemoFn((ev: KeyboardEvent) => {
    if (ev.key === "Enter") {
      setChecked((v) => !v);
    }
  }, []);
  return html`
    <style>
      ${style}
    </style>
    <input
      id="checkbox"
      type="checkbox"
      class=${invalid ? "invalid" : undefined}
      .checked=${!!checked}
      .disabled=${disabled}
      @keypress=${handleKeypress}
    />
    <label for="checkbox">
      <slot></slot>
    </label>
  `;
});
