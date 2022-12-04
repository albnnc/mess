import {
  createThemedElement,
  html,
  Template,
  useElement,
  useMemo,
  useMemoFn,
  useProp,
  useQuery,
} from "../deps.ts";
import { useDrop } from "../hooks/mod.ts";

export interface TnSelectOption {
  title: string | (() => Template);
  value: unknown;
  disabled?: boolean;
}

export const TnSelect = createThemedElement<{
  options?: TnSelectOption;
  value?: unknown;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
}>(() => {
  const [options] = useProp<TnSelectOption[] | undefined>("options", undefined);
  const [value, setValue] = useProp<unknown>("value", undefined);
  const [placeholder] = useProp("placeholder", "");
  const [disabled] = useProp("disabled", false);
  const [invalid] = useProp("invalid", false);
  const [button] = useQuery("button");
  const element = useElement();
  const { openDropMenu } = useDrop();
  const renderTitle = useMemoFn(
    (v?: TnSelectOption["title"]) => (v instanceof Function ? v() : v),
    []
  );
  const title = useMemo(
    () => renderTitle(options?.find((v) => v.value === value)?.title),
    [options, value]
  );
  const handleClick = useMemoFn(() => {
    if (!button) {
      return;
    }
    const targets = options?.length
      ? options
      : [{ value: Symbol(), title: "No Data", disabled: true }];
    openDropMenu(button, {
      tailored: true,
      render: () => html`
        <tn-drop-menu>
          ${targets.map(
            (v) => html`
              <tn-drop-menu-item
                .value=${v.value}
                .disabled=${v.disabled}
                .active=${v.value === value}
              >
                ${renderTitle(v.title)}
              </tn-drop-menu-item>
            `
          )}
        </tn-drop-menu>
      `,
    })
      .then((v) => {
        setValue(v);
        element.dispatchEvent(
          new InputEvent("input", {
            bubbles: true,
            composed: true,
          })
        );
      })
      .catch(() => undefined);
  }, [button, value, options, openDropMenu, renderTitle]);
  return html`
    <button
      class=${[disabled && "disabled", invalid && "invalid"]
        .filter(Boolean)
        .join(" ")}
      .disabled=${disabled}
      @click=${handleClick}
    >
      ${title ||
      (placeholder && html`<span class="placeholder">${placeholder}</span>`)}
    </button>
  `;
});