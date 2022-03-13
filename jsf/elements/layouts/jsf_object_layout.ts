import { createCustomElement, html } from "../../deps.ts";
import { useFieldProps } from "../../hooks/mod.ts";
import { FieldProps } from "../../types/mod.ts";

export const JsfObjectLayout = createCustomElement<FieldProps>(() => {
  const { schema } = useFieldProps();
  return html`
    ${schema.title && html`<div class="title">${schema.title}</div>`}
    <div class="control">
      <slot />
    </div>
    <!-- <ErrorList validity="{validity}" /> -->
  `;
});
