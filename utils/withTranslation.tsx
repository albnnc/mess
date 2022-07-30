/** @jsx jsx */
import { jsx } from "@theme-ui/core";
import { ComponentType, FunctionComponent } from "preact";
import { Suspense } from "preact/compat";
import "../utils/i18n.ts";

// export function withTranslation<C extends ComponentType<any>>(Component: C) {
export function withTranslation(Component: any) {
  return ((props: any) => {
    return (
      <div>
        <Suspense fallback="FALLBACK">
          <Component {...props} />
        </Suspense>
      </div>
    );
  }) as any;
}
