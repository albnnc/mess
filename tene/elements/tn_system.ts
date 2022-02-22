import { systemContext } from "../contexts/mod.ts";
import {
  createCustomElement,
  html,
  themeContext,
  useContextProvider,
  useMemo,
  useQuery,
  useThemeStyle,
} from "../deps.ts";
import { theme } from "../mod.ts";

export const TnSystemPortalHolder = createCustomElement(
  () => html`<div></div>`
);

export const TnSystem = createCustomElement(() => {
  const style = useThemeStyle();
  // TODO: Consider better portal mechanics.
  const [systemPortal] = useQuery("tn-system-portal-holder");
  const portal = systemPortal?.shadowRoot?.firstChild as Element | undefined;
  const systemContextValue = useMemo(() => ({ portal }), [portal]);
  useContextProvider(systemContext, systemContextValue);
  // TODO: Make theme configurable.
  useContextProvider(themeContext, theme);
  return html`
    <style>
      ${style}
    </style>
    <slot></slot>
    <tn-system-portal-holder></tn-system-portal-holder>
  `;
});
