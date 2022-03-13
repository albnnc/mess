import { html, createCustomElement, toProps, useProp } from "../deps.ts";
import { FormManager } from "../types/mod.ts";
import { getControlElementTag } from "../utils/mod.ts";
import { JsfValidityEvent, JsfValueEvent } from "../events/mod.ts";

export const JsfForm = createCustomElement<{
  manager: FormManager;
}>(() => {
  const [manager] = useProp<undefined | FormManager>("manager", undefined);
  if (!manager) {
    return "Manager has to be provided";
  }
  const {
    options: { schema },
    value,
    setValue,
    validity,
    valid,
    validate,
    extendValidity,
    wait,
    submit,
  } = manager;
  const rootFieldProps = { schema, value, validity };
  const rootFieldTag = getControlElementTag(schema);
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
      <${rootFieldTag}
        ...${toProps(rootFieldProps)}
        @jsf-value=${(ev: JsfValueEvent) => {
          setValue(ev.value);
          validate(ev.value);
        }}
        @jsf-validity=${(ev: JsfValidityEvent) => {
          extendValidity(ev.validity);
        }}
      />
      <slot />
    </form>
  `;
});
