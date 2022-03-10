import { html, useMemoFn, useProp } from "../deps.ts";
import { createThemedElement } from "../utils/mod.ts";

export const TnCheckbox = createThemedElement<{
  checked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}>(() => {
  const [checked, setChecked] = useProp("checked", false);
  const [disabled] = useProp("disabled", false);
  const [invalid] = useProp("invalid", false);
  const handleKeypress = useMemoFn((ev: KeyboardEvent) => {
    if (ev.key === "Enter") {
      setChecked((v) => !v);
    }
  }, []);
  return html`
    <input
      id="checkbox"
      type="checkbox"
      class=${invalid ? "invalid" : undefined}
      .checked=${!!checked}
      .disabled=${disabled}
      @keypress=${handleKeypress}
    />
    <label for="checkbox">
      <slot />
    </label>
  `;
});
