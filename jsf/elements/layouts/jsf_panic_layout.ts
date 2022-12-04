import { createThemedElement, html } from "../../deps.ts";
import { useFieldProps } from "../../hooks/mod.ts";
import { FieldProps } from "../../types/mod.ts";

export const JsfPanicLayout = createThemedElement<FieldProps>(() => {
  const { schema } = useFieldProps();
  return html`
    ${schema.title && html`<div class="title">${schema.title}</div>`}
    <div class="content">
      <slot />
    </div>
  `;
});