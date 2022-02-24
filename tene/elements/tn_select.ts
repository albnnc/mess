import {
  createCustomElement,
  html,
  TemplateNode,
  useMemo,
  useMemoFn,
  useProp,
  useQuery,
  useThemeStyle,
} from "../deps.ts";
import { useDrop } from "../hooks/mod.ts";

export interface TnSelectOption {
  title: string | (() => TemplateNode | TemplateNode[]);
  value: unknown;
}

export const TnSelect = createCustomElement(() => {
  const style = useThemeStyle();
  const [button] = useQuery("button");
  const { openDropMenu } = useDrop();
  const [options] = useProp<TnSelectOption[] | undefined>(undefined, {
    name: "options",
  });
  const [value, setValue] = useProp<unknown>(undefined, { name: "value" });
  const renderTitle = useMemoFn(
    (v?: TnSelectOption["title"]) => (v instanceof Function ? v() : v),
    []
  );
  const title = useMemo(
    () => renderTitle(options?.find((v) => v.value === value)?.title),
    [options, value]
  );
  const [placeholder] = useProp("", { name: "placeholder" });
  const [disabled] = useProp(false, { name: "disabled" });
  const [invalid] = useProp(false, { name: "invalid" });
  return html`
    <style>
      ${style}
    </style>
    <button
      class=${[disabled && "disabled", invalid && "invalid"]
        .filter(Boolean)
        .join(" ")}
      .disabled=${disabled}
      @click=${async () => {
        if (!button) {
          return;
        }
        const targets = options?.length
          ? options
          : [{ value: undefined, title: "No Data" }];
        const pick = await openDropMenu(button, {
          tailored: true,
          render: () => html`
            ${targets.map(
              (v) =>
                html`
                  <tn-drop-menu-item .value=${v.value}>
                    ${renderTitle(v.title)}
                  </tn-drop-menu-item>
                `
            )}
          `,
        });
        setValue(pick);
      }}
    >
      ${title ||
      (placeholder && html`<span class="placeholder">${placeholder}</span>`)}
    </button>
  `;
});