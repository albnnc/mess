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

export const TnSystemPortalHolder = createCustomElement(() => html`<div />`);

export const TnSystem = createCustomElement(() => {
  // TODO: Consider better portal mechanics.
  const [systemPortal] = useQuery("tn-system-portal-holder");
  const portal = systemPortal?.shadowRoot?.firstChild as Element | undefined;
  const systemContextValue = useMemo(() => ({ portal }), [portal]);
  useContextProvider(systemContext, systemContextValue);
  // TODO: Make theme configurable.
  useContextProvider(themeContext, theme);
  // Has to be called after provider definition
  // in order to grab context defined on itself.
  const style = useThemeStyle();
  return html`
    <style>
      ${style}
    </style>
    <slot />
    <tn-system-portal-holder />
  `;
});
