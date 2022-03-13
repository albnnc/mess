import { html, createCustomElement, toProps, useProp } from "../deps.ts";
import { FormManager } from "../types/mod.ts";
import { getControlElementName } from "../utils/mod.ts";

export const JsfForm = createCustomElement<{
  manager: FormManager;
}>(() => {
  const [manager] = useProp<undefined | FormManager>("manager", undefined);
  if (!manager) {
    return "No manager";
  }
  const {
    options: { schema },
    value,
    validity,
    valid,
    wait,
    submit,
  } = manager;
  const rootFieldProps = {
    schema,
    value,
    validity,
  };
  const rootFieldTag = getControlElementName(schema);
  return html`
    <form
      novalidate
      @submit=${async (ev: SubmitEvent) => {
        ev.preventDefault();
        await wait();
        if (!valid) {
          return;
        }
        submit();
      }}
    >
      <${rootFieldTag} ...${toProps(rootFieldProps)} />
      <slot />
    </form>
  `;
});
