import {
  createCustomElement,
  html,
  useMemoFn,
  useProp,
  useThemeStyle,
} from "../deps.ts";

export const TnCheckbox = createCustomElement<{
  checked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}>(() => {
  const style = useThemeStyle();
  const [checked, setChecked] = useProp("checked", false);
  const [disabled] = useProp("disabled", false);
  const [invalid] = useProp("invalid", false);
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
