import { createThemedElement, html } from "../../deps.ts";
import { useFieldProps } from "../../hooks/mod.ts";
import { FieldProps } from "../../types/mod.ts";

export const JsfPrimitiveLayout = createThemedElement<FieldProps>(() => {
  const { schema, validity } = useFieldProps();
  return html`
    ${schema.title && html`<div class="title">${schema.title}</div>`}
    <div class="control">
      <slot />
    </div>
    <jsf-error-list .errors=${validity?.errors} />
  `;
});
